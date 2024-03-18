import { createNoteSchema } from "@/lib/validation/note";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import LoadingButton from "./ui/loaoding-button";
import { useRouter } from "next/navigation";

interface AddNoteDialogProps {
    open: boolean,
    setopen: (open: boolean)=> void,
}
export default function AddNoteDialog({open, setopen}:AddNoteDialogProps){

    const router = useRouter();

        const form = useForm<createNoteSchema>({
            resolver: zodResolver(createNoteSchema),
            defaultValues:{
                title: "",
                content: "",
            },
        });

        


        async function onSubmit(input: createNoteSchema) {
            try{
                const response = await fetch("/api/notes", {
                    method: "POST",
                    body: JSON.stringify(input),
                });

                if(!response.ok) throw Error ("status code: " + response.status)
                form.reset();
                router.refresh();
                setopen(false);
            } catch(error){
                console.error(error)
                alert("something went wrogn. please try again")
            }
        }

        return(
            <Dialog open={open} onOpenChange={setopen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Note</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                            <FormField 
                            control={form.control}
                            name="title"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Note Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Note title" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField 
                            control={form.control}
                            name="content"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Note content</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Note content" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <DialogFooter>
                                <LoadingButton type="submit" loading={form.formState.isSubmitting}>
                                    Submit
                                </LoadingButton>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        )
}