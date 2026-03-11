import { mockCarrierHistory } from "@/app/lib/schemas";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";


export const apiClient = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const querySchema = z.object({
    page: z.string(),
    pageSize: z.string(),
});

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const page = searchParams.get("page") || "1";
        const pageSize = searchParams.get("pageSize") || "10";

        const parsed = querySchema.safeParse({ page, pageSize });

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid query parameters" },
                { status: 400 }
            );
        }

        const pageNum = parseInt(parsed.data.page);
        const pageSizeNum = parseInt(parsed.data.pageSize);

        const res = {
            data: mockCarrierHistory,
            pagination: {
                total: mockCarrierHistory.length,
                page_size: pageSizeNum,
                current_page: pageNum,
            }
        };

        // const { data: res } = await apiClient.get("/carriers", {
        //     params: {
        //         page: pageNum,
        //         limit: pageSizeNum,
        //     }
        // });

        return NextResponse.json(res);
    } catch (error) {
        console.error("Error fetching carriers:", error);
        return NextResponse.json(
            { error: "Failed to fetch carriers" },
            { status: 500 }
        );
    }
}