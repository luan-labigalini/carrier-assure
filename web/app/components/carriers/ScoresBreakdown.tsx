import useGetCarrier from "@/app/hooks/useGetCarrier";
import { Empty, Modal, Spin } from "antd";
import { Suspense } from "react";
import {
    ChartOptions,
} from 'chart.js';
import { Radar } from "react-chartjs-2";

type ScoresBreakdownProps = {
    carrierId?: string;
    onClose: () => void;
}

export default function ScoresBreakdown(props: ScoresBreakdownProps) {
    if (!props.carrierId) return null;

    return <Modal
        open={true}
        title="Scores Breakdown"
        width={600}
        onCancel={props.onClose}
        footer={null}
    >
        <Suspense fallback={<Spin spinning={true} />}>
            <Content carrierId={props.carrierId} />
        </Suspense>
    </Modal>
}

const Content = (props: { carrierId: string }) => {
    const { data: carrier } = useGetCarrier({ ...props });

    if (!carrier) {
        return <Empty  />
    }

// --- AI-ASSISTED ---
// Tool: Copilot
// Prompt: "Configure a Chart.JS radar visualization"
// Modifications: Created the component and data settings.
// --- END AI-ASSISTED ---

    const labels = Object.keys(carrier.score_breakdown);
    const values = Object.values(carrier.score_breakdown);

    // Mock scoring data - replace with actual data from carrier
    const radarData = {
        labels: labels,
        datasets: [
            {
                label: carrier.legal_name,
                data: values,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true,
            },
        ],
    };

    const chartOptions: ChartOptions<'radar'> = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 20,
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
            },
        },
    };

    return (
        <div style={{ width: '100%', height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Radar data={radarData} options={chartOptions} />
        </div>
    );
}