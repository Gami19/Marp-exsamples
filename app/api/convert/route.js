import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import mammoth from "mammoth";
import tmp from 'tmp';

const execPromise = promisify(exec);
const tmpDir = promisify(tmp.dir);

export async function POST(req) {
    let tmpDirPath = null; // tmpDirPathをtryブロックの外で宣言
    try {
        const { markdown, css, format } = await req.json();

        if (!markdown) {
            return NextResponse.json({ error: 'Markdown is required' }, { status: 400 });
        }

        try { // tmpDirのtry-catchを追加
            const tmpObj = await tmpDir({ prefix: 'marp-', unsafeCleanup: true });
            tmpDirPath = tmpObj.path;
        } catch (tmpError) {
            console.error("Error creating temporary directory:", tmpError);
            return NextResponse.json({ error: 'Failed to create temporary directory', details: tmpError.message }, { status: 500 });
        }


        const markdownFilePath = path.join(tmpDirPath, 'temp.md');
        const outputFilePath = path.join(tmpDirPath, 'output.html');

        await fs.writeFile(markdownFilePath, markdown);

        const { stderr } = await execPromise(
            `marp --style '${css || ''}' -o ${outputFilePath} ${markdownFilePath}`
        );

        if (stderr) {
            console.error("Marp CLI Error:", stderr);
            throw new Error(`Marp conversion failed: ${stderr}`);
        }

        const html = await fs.readFile(outputFilePath, 'utf-8');

        if (format === 'pptx') {
            try {
                const docxBuffer = await mammoth.convertToBuffer({ html: html });
                const docxFilePath = path.join(tmpDirPath, 'output.docx');
                await fs.writeFile(docxFilePath, docxBuffer.value);
                const docxFile = await fs.readFile(docxFilePath);

                return new NextResponse(docxFile, {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'Content-Disposition': 'attachment; filename="presentation.docx"',
                    },
                });
            } catch (mammothError) {
                console.error("Mammoth Error:", mammothError);
                throw new Error(`DOCX conversion failed: ${mammothError.message}`);
            }
        } else {
            return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html' } });
        }
    } catch (error) {
        console.error("General Error:", error);
        return NextResponse.json({ error: 'An error occurred during conversion', details: error.message }, { status: 500 });
    } finally {
        if (tmpDirPath) {
            try {
                await fs.rm(tmpDirPath, { recursive: true, force: true });
                console.log(`Successfully cleaned up temporary directory: ${tmpDirPath}`); // クリーンアップ成功のログを追加
            } catch (cleanupError) {
                console.error("Error cleaning up temporary directory:", cleanupError);
            }
        }
    }
}