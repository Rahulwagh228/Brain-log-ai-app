import { createNoteSchema } from "@/lib/validation/note";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import LoadingButton from "./ui/loaoding-button";
import { useRouter } from "next/navigation";
import { Note } from "@prisma/client";
import { useState } from "react";

interface AddEditNoteDialogProps {
  open: boolean;
  setopen: (open: boolean) => void;
  noteToEdit?: Note;
}
export default function AddEditNoteDialog({ open, setopen, noteToEdit }: AddEditNoteDialogProps) {
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const router = useRouter();

  const form = useForm<createNoteSchema>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: noteToEdit?.title || "",
      content:noteToEdit?.content ||  "",
    },
  });

  async function onSubmit(input: createNoteSchema) {
    try {

      if(noteToEdit){
          const response = await fetch("/api/note", {
            method: "PUT",
            body:  JSON.stringify({
              id: noteToEdit.id,
              ...input
            }),
          });
      if (!response.ok) throw Error("status code: " + response.status);

      }else{


      const response = await fetch("/api/notes", {
        method: "POST",
        body: JSON.stringify(input),
      });

      if (!response.ok) throw Error("status code: " + response.status);
      form.reset();
    }

      router.refresh();
      setopen(false);
    } catch (error) {
      console.error(error);
      alert("something went wrong. please try again");
    }
  }


async function deleteNote(){
  if(!noteToEdit) return;
  setDeleteInProgress(true)
  try {
    const response = await fetch("/api/notes",{
      method: "DELETE",
      body: JSON.stringify({
        id: noteToEdit.id
      })
    })
    if (!response.ok) throw Error("status code: " + response.status);

  } catch (error) {
    console.error(error);
      alert("something went wrong. please try again");
  }finally{
    setDeleteInProgress(false)
  }
}


  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{noteToEdit ? "Edit Note" : "Add Note"}
            <div className="text-center font-extrabold">Add Note</div>
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Note title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Note content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-1 sm:gap-0">
              {noteToEdit && (
                <LoadingButton
                variant="destructive"
                loading={deleteInProgress}
                disabled={form.formState.isSubmitting}
                onClick={deleteNote}
                type="button"
                >
                  Delete Note
                </LoadingButton>
                
              )}
              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
                disabled={deleteInProgress}
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
