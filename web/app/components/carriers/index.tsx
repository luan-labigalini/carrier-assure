"use client"

import useGetCarriers from "@/app/hooks/useGetCarriers";
import { getScoreColor } from "@/app/logic";
import { Table, TableProps } from "antd";
import { useState } from "react";
import ScoresBreakdown from "./ScoresBreakdown";
import UploadFile from "./UploadFile";
import { CarrierHistoryItem } from "@/app/lib/schemas";
import { ColumnsType } from "antd/es/table/InternalTable";

export default function Carriers() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [carrierId, setCarrierId] = useState<string | undefined>(undefined);
    
    const { data: carriers } = useGetCarriers({ page, pageSize });

    const dataSource = carriers?.data;

    const onClick = (id: string) => {
        console.log("Clicked carrier with id:", id);
        setCarrierId(id);
    }

    const columns = [
        {
            title: "Legal Name",
            dataIndex: "legal_name",
            alignn: 'center',
            render: (text: string, record: typeof dataSource[number]) => <a onClick={() => {
                onClick(record.id);
            }}>{text}</a>
        },
        {
            title: "DOT Number",
            dataIndex: "dot_number",
            alignn: 'center',
        },
        {
            title: "Score",
            dataIndex: "score",
            alignn: 'center',
            render: (score: number) => <Score score={score} />,
            
        },
        {
            title: "Authority Status",
            dataIndex: "authority_status",
            alignn: 'center',
        }
    ]

    return <>
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "5px" }}>
        <UploadFile />
    </div>
        <CarriersDashboard 
        dataSource={dataSource}
        columns={columns}
        pagination={{
            current: page,
            pageSize,
            total: carriers?.pagination.total,
            onChange: (newPage, newPageSize) => {            
                setPage(newPage);
                setPageSize(newPageSize);
            }
        }}
        />
        <ScoresBreakdown 
            carrierId={carrierId}
            onClose={() => setCarrierId(undefined)}
        />
    </>
}

const Score = ({ score }: { score: number }) => {
    const color = getScoreColor(score);

    return (
        <span 
            style={{ 
                color: "#ffff",
                backgroundColor: color,
                padding: "4px 8px",
                borderRadius: "4px",
                fontWeight: "600"
            }}
        >
            {score}
        </span>
    );
}

type CarriersDashboardProps = {
    pagination: TableProps["pagination"];
    columns: ColumnsType<CarrierHistoryItem>;
    dataSource: CarrierHistoryItem[]
}

export const CarriersDashboard = (props: CarriersDashboardProps) => {
    const { pagination, columns, dataSource } = props;
    return <Table 
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
    />
};
