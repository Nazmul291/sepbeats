
class thankyou_table {
  model = "thankyou";
  fields = {
    shop: {
      type: String,
      required: true,
      unique: true
    },
    metafield : {
        type: Object,
        default: {}
    }
  };
}

export default new thankyou_table;