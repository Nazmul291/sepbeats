
class samples_table {
    model = "Samples";
    fields = {
        pack_id: {
            type: Number,
            default: null
        },
        sample_id: {
            type: Number,
            default: null
        },
        filesUrl: {
            type: String,
            default: null
        },
        metafield_id: {
            type: Number,
            default: null
        },
        metafield: {
            type: Object,
            default: {}
        },
        created_at: {
            type: Date,
            default: new Date()
        },
        updated_at: {
            type: Date,
            default: null
        }
    };
}

export default new samples_table;