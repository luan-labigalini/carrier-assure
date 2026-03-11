// import { mockCarrierHistory } from "@/app/lib/schemas";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const apiClient = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


const input = z.object({
    carrierId: z.string(),
})


export async function GET(req: NextRequest,  { params }: { params: Promise<{ id: string }> }) {
    const { id: carrierId } = await params;    
    const parsedParams = input.safeParse({ carrierId });

    if (!parsedParams.success) {
        throw Error("Invalid query parameters");
    }

    try {

        // const res = mockCarrierHistory.find(carrier => carrier.id === parsedParams.data.carrierId);
        const res = await apiClient.get("/carrier", {
            params: {
                carrier_id: parsedParams.data.carrierId
            }
        });

        return NextResponse.json(res);
        
    } catch (error) {
        console.error("Error fetching carrier id:", error);
        return NextResponse.json({ error: "Failed to fetch carrier" }, { status: 500 });
    }
}