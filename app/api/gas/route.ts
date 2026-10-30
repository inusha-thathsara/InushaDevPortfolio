import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Prevent caching

export async function GET() {
    try {
        const apiKey = process.env.ETHERSCAN_API_KEY || process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'Configuration Error', details: 'API Key missing' },
                { status: 500 }
            );
        }

        const response = await fetch(
            `https://api.etherscan.io/v2/api?chainid=1&module=gastracker&action=gasoracle&apikey=${apiKey}`,
            { next: { revalidate: 30 } } // Revalidate every 30s
        );

        if (!response.ok) {
            throw new Error(`Etherscan API Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "1" && data.result) {
            return NextResponse.json(data);
        } else {
            return NextResponse.json(data, { status: 400 });
        }

    } catch (error: any) {
        console.error("Gas Proxy Error:", error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
