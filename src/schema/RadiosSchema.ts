import { z } from 'zod'

export const RadioSchema = z.object({
    stationuuid: z.string(),
    name: z.string(),
    url_resolved: z.string(),
    favicon: z.string().optional(),
    tags: z.string().optional(),
    country: z.string(),
    countrycode: z.string(),
    state: z.string().optional(),
    votes: z.number(),
    lastcheckok: z.number().optional(),
    hls: z.number().optional(),
    codec: z.string().optional(),
})

export const RadiosSchema = z.array(RadioSchema)

export type Radio = z.infer<typeof RadioSchema>
export type Radios = z.infer<typeof RadiosSchema>
