import { NOTIFY } from "./config"

const TITLE = "Proiect aprobat!"
const MESSAGE = "Andreea a apăsat pe „Aprob proiectul”. A zis DA!"

export async function notifyAccepted(): Promise<boolean> {
  const requests: Promise<Response>[] = []

  if (NOTIFY.ntfyTopic) {
    requests.push(
      fetch("https://ntfy.sh/", {
        method: "POST",
        body: JSON.stringify({
          topic: NOTIFY.ntfyTopic,
          title: TITLE,
          message: MESSAGE,
          tags: ["tada", "building_construction"],
          priority: 5,
        }),
        keepalive: true,
      }),
    )
  }

  if (NOTIFY.email) {
    requests.push(
      fetch(`https://formsubmit.co/ajax/${NOTIFY.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: TITLE,
          _captcha: "false",
          mesaj: MESSAGE,
          ora: new Date().toLocaleString("ro-RO"),
        }),
        keepalive: true,
      }),
    )
  }

  const results = await Promise.allSettled(requests)
  return results.some((r) => r.status === "fulfilled" && r.value.ok)
}
