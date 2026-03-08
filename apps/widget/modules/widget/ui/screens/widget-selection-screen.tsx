"use client";

import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import { ChevronRightIcon, MessageSquareTextIcon, MicIcon, PhoneIcon } from "lucide-react";
import { contactSessionIdAtomFamily, conversationIdAtom, errorMessageAtom, hasVapiSecretsAtom, organizationIdAtom, screenAtom, widgetSettingsAtom } from "../../atoms/widget-atoms";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useState } from "react";
import { WidgetFooter } from "../components/widget-footer";
import { format } from "date-fns";
import { uz } from "date-fns/locale/uz";

export const WidgetSelectionScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setConversationId = useSetAtom(conversationIdAtom);

  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const hasVapiSecrets = useAtomValue(hasVapiSecretsAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );

  const createConversation = useMutation(api.public.conversations.create);
  const [isPending, setIsPending] = useState(false);

  const handleNewConversation = async () => {
    if (!organizationId) {
      setScreen("error");
      setErrorMessage("Missing Organization ID");
      return;
    }

    if (!contactSessionId) {
      setScreen("auth");
      return;
    }

    setIsPending(true);
    try {
      const conversationId = await createConversation({
        contactSessionId,
        organizationId,
      });

      setConversationId(conversationId);
      setScreen("chat");
    } catch {
      setScreen("auth");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-2 font-semibold">
          <p className="text-2xl">
            Namangan davlat texnika universiteti
          </p>
          <p className="text-sm font-medium opacity-90">
            Onlayn yordamchi bo&apos;limi
          </p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col gap-y-4 p-4 overflow-y-auto">
        <div className="rounded-xl border bg-slate-100 p-4 text-sm shadow-sm">
          <div className="flex flex-col gap-y-3">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold">
              <p className="font-semibold text-slate-800 normal-case tracking-normal text-sm">Assalomu alaykum!</p>
              <span className="text-muted-foreground capitalize">{format(new Date(), "d'-'MMMM", { locale: uz })}</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Maslahatchi savollaringizga onlayn yoki telefon qilish orqali javob qaytaradi! Iltimos o&apos;zingiz haqingizda to&apos;liq ma&apos;lumot qoldiring!
            </p>
            <div className="pt-2 border-t border-slate-200">
              <p className="text-[11px] font-bold text-slate-500 uppercase mb-1">Qabul masalalarida Call-markaz:</p>
              <p className="text-base font-bold text-primary tracking-tight">(69)-234-14-30</p>
            </div>
          </div>
        </div>
        <Button
          className="h-16 w-full justify-between"
          variant="outline"
          onClick={handleNewConversation}
          disabled={isPending}
        >
          <div className="flex items-center gap-x-2">
            <MessageSquareTextIcon className="size-4" />
            <span>Chatni boshlash</span>
          </div>
          <ChevronRightIcon />
        </Button>
        {hasVapiSecrets && widgetSettings?.vapiSettings?.assistantId && (
          <Button
            className="h-16 w-full justify-between"
            variant="outline"
            onClick={() => setScreen("voice")}
            disabled={isPending}
          >
            <div className="flex items-center gap-x-2">
              <MicIcon className="size-4" />
              <span>Ovozli muloqot</span>
            </div>
            <ChevronRightIcon />
          </Button>
        )}
        {hasVapiSecrets && widgetSettings?.vapiSettings?.phoneNumber && (
          <Button
            className="h-16 w-full justify-between"
            variant="outline"
            onClick={() => setScreen("contact")}
            disabled={isPending}
          >
            <div className="flex items-center gap-x-2">
              <PhoneIcon className="size-4" />
              <span>Bizga qo&apos;ng&apos;iroq qiling</span>
            </div>
            <ChevronRightIcon />
          </Button>
        )}
      </div>
      <WidgetFooter />
    </>
  );
};
