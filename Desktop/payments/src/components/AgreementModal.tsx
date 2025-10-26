"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AgreementModalProps {
  children: React.ReactNode;
  title: string;
  content: string;
}

export function AgreementModal({ children, title, content }: AgreementModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="flex flex-col w-[50vmin] h-[50vmin] max-w-[90vw] max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {content}
          </div>
        </ScrollArea>
        <div className="flex justify-end px-6 py-4 border-t shrink-0">
          <Button onClick={() => setOpen(false)}>
            확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
