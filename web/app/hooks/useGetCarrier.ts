import { useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/app/lib/api-client";
import { ScoredCarrier } from "../lib/schemas";

type GetCarrierProps = {
    carrierId: string;
}


export default function useGetCarrier({ carrierId }: GetCarrierProps) {
    return useSuspenseQuery<ScoredCarrier | null>({
        queryKey: ["carrier", carrierId],
        queryFn: async () => {
            return apiClient.get(`/carriers/${carrierId}`);
        }
    })
}