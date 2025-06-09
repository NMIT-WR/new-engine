import type {MedusaRequest, MedusaResponse,} from "@medusajs/framework/http"
import seedN1Workflow from "../../workflows/seed/workflows/seed-n1";

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
) {

    const input = {}

    const {result} = await seedN1Workflow(req.scope)
        .run({
            input
        })

    res.send(result)
}