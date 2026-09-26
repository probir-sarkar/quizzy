"use client";

import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  XIcon
} from "react-share";

import { FacebookIcon, TwitterIcon, WhatsappIcon, LinkedinIcon, TelegramIcon } from "react-share";

type Props = {
  url: string;
  title?: string;
};

const buttonClass =
  "flex h-10 w-10 items-center justify-center border-2 border-foreground transition-transform hover:-translate-y-1 hover:shadow-pop hover:[--pop-x:3px] hover:[--pop-y:3px]";

export default function ShareButtons({ url, title = "Check this out!" }: Props) {
  return (
    <div className="mt-8 flex items-center gap-3">
      <span className="mr-1 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
        Share
      </span>
      <FacebookShareButton url={url} title={title} className={buttonClass} style={{ ["--pop" as string]: "var(--pop-blue)" }}>
        <FacebookIcon size={22} />
      </FacebookShareButton>

      <TwitterShareButton url={url} title={title} className={buttonClass} style={{ ["--pop" as string]: "var(--pop-rose)" }}>
        <XIcon size={22} className="fill-current" />
      </TwitterShareButton>

      <WhatsappShareButton url={url} title={title} className={buttonClass} style={{ ["--pop" as string]: "var(--pop-lime)" }}>
        <WhatsappIcon size={22} />
      </WhatsappShareButton>

      <LinkedinShareButton url={url} title={title} className={buttonClass} style={{ ["--pop" as string]: "var(--pop-cyan)" }}>
        <LinkedinIcon size={22} />
      </LinkedinShareButton>

      <TelegramShareButton url={url} title={title} className={buttonClass} style={{ ["--pop" as string]: "var(--pop-violet)" }}>
        <TelegramIcon size={22} />
      </TelegramShareButton>
    </div>
  );
}
