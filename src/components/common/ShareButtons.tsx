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

export default function ShareButtons({ url, title = "Check this out!" }: Props) {
  return (
    <div className="flex gap-3 items-center mt-6">
      <FacebookShareButton url={url} title={title}>
        <FacebookIcon size={40} round />
      </FacebookShareButton>

      <TwitterShareButton url={url} title={title}>
        <XIcon size={40} round />
      </TwitterShareButton>

      <WhatsappShareButton url={url} title={title} separator=":: ">
        <WhatsappIcon size={40} round />
      </WhatsappShareButton>

      <LinkedinShareButton url={url} title={title}>
        <LinkedinIcon size={40} round />
      </LinkedinShareButton>

      <TelegramShareButton url={url} title={title}>
        <TelegramIcon size={40} round />
      </TelegramShareButton>
    </div>
  );
}
