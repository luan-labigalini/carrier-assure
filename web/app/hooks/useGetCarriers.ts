import { useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/app/lib/api-client";
import { CarrierHistoryItem, Pagination } from "../lib/schemas";

type GetCarriersProps = {
    page: number;
    pageSize: number;
}

export type CarrierData = {
    data: CarrierHistoryItem[],
    pagination: Pagination
}


export default function useGetCarriers({ page, pageSize }: GetCarriersProps) {
    return useSuspenseQuery<CarrierData>({
        queryKey: ["carriers", page, pageSize],
        queryFn: async () => {
            return await apiClient.get("/carriers", {
                params: { page, pageSize }
            });
        }
    });
}