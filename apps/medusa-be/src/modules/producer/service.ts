import {MedusaService} from "@medusajs/framework/utils"
import Producer from "./models/producer";
import ProducerAttribute from "./models/producer-attribute";
import ProducerAttributeType from "./models/producer-attribute-type";

export type UpsertProducerDTO = {
    name: string,
    attributes: {
        name: string,
        value: string,
    }[]
}

class ProducerModuleService extends MedusaService({
    Producer,
    ProducerAttribute,
    ProducerAttributeType,
}) {
    async upsertProducer(input: UpsertProducerDTO): Promise<(Awaited<ReturnType<typeof this.createProducers>>[number])> {
        // create producer or get existing one
        let producer = (await this.listProducers({title: input.name}, {take: 1})).shift()

        if (!producer) {
            producer = (await this.createProducers({
                title: input.name
            }))
        }

        // create missing attribute types
        const attributeTypes = input.attributes.map(i => i.name)
        const attributeTypesMap: Map<string, string> = new Map();

        const attributeTypesExisting = await this.listProducerAttributeTypes({name: {$in: attributeTypes}})
        const attributeTypesToCreate = attributeTypes.filter(i => !attributeTypesExisting.find(j => j.name === i))

        attributeTypesExisting.map(i => attributeTypesMap.set(i.name, i.id))

        await this.createProducerAttributeTypes(
            attributeTypesToCreate.map(i => ({name: i}))
        ).then(result => {
            result.map(i => attributeTypesMap.set(i.name, i.id))
            return result
        })

        // create or update attributes for producer
        const attributes = input.attributes.map(i => ({
            value: i.value,
            attributeType_id: attributeTypesMap.get(i.name),
            producer_id: producer.id,
        }))

        const attributesExisting = await this.listProducerAttributes({
            producer_id: producer.id,
            attribute_type_id: {$in: attributeTypes.map(i => attributeTypesMap.get(i))}
        })

        const attributesToCreate = attributes
            .filter(i => !attributesExisting
                .find(j => j.attributeType.id === i.attributeType_id))
            .map(i => ({
                producer_id: producer.id,
                attribute_type_id: i.attributeType_id,
                value: i.value
            }))

        const attributesToUpdate = attributesExisting.map(attributeExisting => {
            const attribute = attributes.find(i => i.attributeType_id === attributeExisting.attributeType.id)
            if (!attribute) {
                return null
            }
            return {
                id: attributeExisting.id,
                value: attribute.value
            }
        })
            .filter(i => i !== null)


        await this.createProducerAttributes(attributesToCreate)
        await this.updateProducerAttributes(attributesToUpdate)

        return producer
    }

}

export default ProducerModuleService