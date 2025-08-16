import { useEffect } from "react";
import { Button } from "@/components/ui/button";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Undo,
  Redo,
  Image as ImageIcon,
} from "lucide-react";

const TiptapToolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  // Setup auto-updating links
  useEffect(() => {
    const updateDynamicLinks = () => {
      const { state } = editor;
      const { doc } = state;
      let updated = false;
      let tr = state.tr;

      doc.descendants((node, pos) => {
        if (node.isText && node.marks) {
          node.marks.forEach(mark => {
            if (mark.type.name === 'link' && mark.attrs.href === 'TYPING_PLACEHOLDER') {
              const linkText = node.text?.trim();
              if (linkText && linkText !== 'type-url-here') {
                // Update href to match the text, add protocol if needed
                let href = linkText;
                if (!href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('#')) {
                  href = `https://${href}`;
                }

                const newMark = mark.type.create({
                  ...mark.attrs,
                  href,
                  target: '_blank',
                  rel: 'noopener noreferrer'
                });

                tr = tr.removeMark(pos, pos + node.nodeSize, mark)
                       .addMark(pos, pos + node.nodeSize, newMark);
                updated = true;
              }
            }
          });
        }
      });

      if (updated) {
        editor.view.dispatch(tr);
      }
    };

    editor.on('update', updateDynamicLinks);

    return () => {
      editor.off('update', updateDynamicLinks);
    };
  }, [editor]);

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url && url.trim()) {
      try {
        new URL(url);
        editor.chain().focus().setImage({
          src: url.trim(),
          alt: 'User uploaded image'
        }).run();
      } catch (error) {
        alert('Please enter a valid URL');
      }
    }
  };

  const addLink = () => {
    if (editor.isActive('link')) {
      // If already on a link, remove it
      editor.chain().focus().unsetLink().run();
    } else {
      // Insert placeholder text and make it a special link
      editor.chain()
        .focus()
        .insertContent('type-url-here')
        .setTextSelection({
          from: editor.state.selection.from - 13,
          to: editor.state.selection.from
        })
        .setLink({ href: 'TYPING_PLACEHOLDER' })
        .run();
    }
  };

  return (
    <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "bg-gray-400 text-black" : ""}
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "bg-gray-400 text-black" : ""}
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "bg-gray-400 text-black" : ""}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={
          editor.isActive({ textAlign: "left" }) ? "bg-gray-400 text-black" : ""
        }
      >
        <AlignLeft className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={
          editor.isActive({ textAlign: "center" })
            ? "bg-gray-400 text-black"
            : ""
        }
      >
        <AlignCenter className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={
          editor.isActive({ textAlign: "right" })
            ? "bg-gray-400 text-black"
            : ""
        }
      >
        <AlignRight className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          editor.isActive("bulletList") ? "bg-gray-400 text-black" : ""
        }
      >
        <List className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          editor.isActive("orderedList") ? "bg-gray-400 text-black" : ""
        }
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={addLink}
        className={editor.isActive("link") ? "bg-blue-100 text-blue-600" : ""}
        title={editor.isActive("link") ? "Remove link" : "Add link - click and type URL"}
      >
        <LinkIcon className="h-4 w-4" />
      </Button>

      <Button type="button" variant="ghost" size="sm" onClick={addImage}>
        <ImageIcon className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TiptapToolbar;
