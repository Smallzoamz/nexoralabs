'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useCallback } from 'react'
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Link as LinkIcon,
    Image as ImageIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Undo2,
    Redo2,
    Minus,
    Code,
    Pilcrow,
} from 'lucide-react'

interface RichTextEditorProps {
    content: string
    onChange: (html: string) => void
}

function ToolbarButton({
    onClick,
    isActive = false,
    disabled = false,
    title,
    children,
}: {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    title: string
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-1.5 rounded-md transition-all shrink-0 ${isActive
                ? 'bg-primary-100 text-primary-700 shadow-sm'
                : 'text-secondary-500 hover:bg-white hover:text-primary-600 hover:shadow-sm'
                } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
            {children}
        </button>
    )
}

function Divider() {
    return <div className="w-px h-5 bg-secondary-300 mx-0.5 shrink-0" />
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-primary-600 underline' },
            }),
            Image.configure({
                HTMLAttributes: { class: 'rounded-xl shadow-md max-w-full' },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({
                placeholder: 'เริ่มเขียนเนื้อหาบทความที่นี่...',
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: 'tiptap-editor prose prose-sm md:prose-base max-w-none focus:outline-none min-h-[400px] px-5 py-4',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    // Sync content when loading existing article for editing
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content, { emitUpdate: false })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content])

    const setLink = useCallback(() => {
        if (!editor) return
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('ใส่ URL ลิงก์:', previousUrl || 'https://')

        if (url === null) return
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }, [editor])

    const addImage = useCallback(() => {
        if (!editor) return
        const url = window.prompt('ใส่ URL รูปภาพ:', 'https://')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }, [editor])

    if (!editor) return null

    return (
        <div className="border border-secondary-200 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all">
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 flex-wrap bg-secondary-50 border-b border-secondary-200 px-2 py-1.5">
                {/* Text Type */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    isActive={editor.isActive('paragraph')}
                    title="ย่อหน้า (Paragraph)"
                >
                    <Pilcrow className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="หัวข้อ H2"
                >
                    <Heading2 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    title="หัวข้อ H3"
                >
                    <Heading3 className="w-4 h-4" />
                </ToolbarButton>

                <Divider />

                {/* Inline Formatting */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="ตัวหนา (Ctrl+B)"
                >
                    <Bold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="ตัวเอียง (Ctrl+I)"
                >
                    <Italic className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    title="ขีดเส้นใต้ (Ctrl+U)"
                >
                    <UnderlineIcon className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    isActive={editor.isActive('code')}
                    title="โค้ด (Code)"
                >
                    <Code className="w-4 h-4" />
                </ToolbarButton>

                <Divider />

                {/* Lists & Block */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="รายการแบบจุด"
                >
                    <List className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="รายการแบบตัวเลข"
                >
                    <ListOrdered className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    title="คำพูดอ้างอิง (Quote)"
                >
                    <Quote className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="เส้นคั่น (Divider)"
                >
                    <Minus className="w-4 h-4" />
                </ToolbarButton>

                <Divider />

                {/* Alignment */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    isActive={editor.isActive({ textAlign: 'left' })}
                    title="ชิดซ้าย"
                >
                    <AlignLeft className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    isActive={editor.isActive({ textAlign: 'center' })}
                    title="กึ่งกลาง"
                >
                    <AlignCenter className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    isActive={editor.isActive({ textAlign: 'right' })}
                    title="ชิดขวา"
                >
                    <AlignRight className="w-4 h-4" />
                </ToolbarButton>

                <Divider />

                {/* Media & Links */}
                <ToolbarButton
                    onClick={setLink}
                    isActive={editor.isActive('link')}
                    title="แทรกลิงก์"
                >
                    <LinkIcon className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={addImage} title="แทรกรูปภาพ (URL)">
                    <ImageIcon className="w-4 h-4" />
                </ToolbarButton>

                <Divider />

                {/* Undo/Redo */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="เลิกทำ (Ctrl+Z)"
                >
                    <Undo2 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="ทำซ้ำ (Ctrl+Y)"
                >
                    <Redo2 className="w-4 h-4" />
                </ToolbarButton>
            </div>

            {/* Editor Area */}
            <EditorContent editor={editor} />
        </div>
    )
}
