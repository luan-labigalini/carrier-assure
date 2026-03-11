import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

// #  --- AI-ASSISTED ---
// #  Tool: Copilot
// #  Prompt: "Structure the upload route to accept a JSON file throughh API"
// #  Modifications: Created and reviewd the route.
// #  --- END AI-ASSISTED ---

export const apiClient = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});


export const config = {
  api: {
    bodyParser: false
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const blob = file as Blob;
    const text = await blob.text();

    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      return NextResponse.json({ error: String(e) }, { status: 400 });
    }

    const forwardForm = new FormData();
    const fileBlob = new Blob([JSON.stringify(json)], { type: 'application/json' });
    forwardForm.append('file', fileBlob, 'payload.json');

    const res = await apiClient.post('/ccf/upload', forwardForm);

    if (res.status !== 200) {
      const msg = res.statusText;
      return NextResponse.json({ error: "Upstream error", details: msg }, { status: 502 });
    }

    const data = res.data;
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("upload error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
