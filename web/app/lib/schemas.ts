// #  --- AI-ASSISTED ---
// #  Tool: Copilot
// #  Prompt: "Convert the pydantic models to Typescript format"
// #  Modifications: Converted the types.
// #  --- END AI-ASSISTED ---

export interface ScoreBreakdown {
    safety: number;
    out_of_service: number;
    crash: number;
    driver_oos: number;
    insurance: number;
    authority_status: number;
}

export interface ScoredCarrier {
    id: string;
    legal_name: string;
    hash: string;
    score: number;
    last_update: string;
    score_breakdown: ScoreBreakdown;
}

export type AuthorityStatus = "Active" | "Inactive" | "Revoked";

export interface CarrierHistoryItem {
    id: string;
    hash: string;
    score: number;
    computed_at: string;
    score_breakdown: ScoreBreakdown;
    legal_name: string;
    dot_number: string;
    authority_status: AuthorityStatus;
}

export interface Pagination {
    current_page: number;
    page_size: number;
    total: number;
}

// Mock data example
export const mockCarrierHistory: CarrierHistoryItem[] = [
    {
        id: "1",
        hash: "hash_abc123",
        score: 85.5,
        computed_at: "2024-03-10T14:30:00Z",
        legal_name: "ABC Trucking Inc.",
        dot_number: "1234567",
        authority_status: "Active",
        score_breakdown: {
            safety: 90,
            out_of_service: 85,
            crash: 80,
            driver_oos: 88,
            insurance: 87,
            authority_status: 92,
        },
    },
    {
        id: "2",
        hash: "hash_def456",
        score: 72.3,
        computed_at: "2024-03-10T16:45:00Z",
        legal_name: "XYZ Transport LLC",
        dot_number: "7654321",
        authority_status: "Active",
        score_breakdown: {
            safety: 70,
            out_of_service: 75,
            crash: 65,
            driver_oos: 72,
            insurance: 78,
            authority_status: 80,
        },
    },
    {
        id: "3",
        hash: "hash_ghi789",
        score: 58.2,
        computed_at: "2024-03-10T12:15:00Z",
        legal_name: "FastFreight Corp",
        dot_number: "5555555",
        authority_status: "Inactive",
        score_breakdown: {
            safety: 55,
            out_of_service: 60,
            crash: 50,
            driver_oos: 58,
            insurance: 62,
            authority_status: 65,
        },
    },
];