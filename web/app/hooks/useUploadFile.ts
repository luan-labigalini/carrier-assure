import { useMutation } from "@tanstack/react-query";
import type { RcFile } from 'antd/es/upload';
import { apiClient } from "../lib/api-client";


export default function useUploadFile() {
    return useMutation({
        mutationFn: async (file: RcFile) => {
            const formData = new FormData();
            formData.append('file', file as RcFile);
            const res = await apiClient.post("/files/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
            }})

            if (!res.data) throw new Error(`Upload failed: ${res.statusText}`);

            return res.data;
        }
    })
}