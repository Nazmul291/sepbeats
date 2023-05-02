import Model from '../app/Model.js';
import table from '../databases/thankyou_table.js';

class ThankyouModel extends Model{
  constructor(){
    super(table);
  }
  updateByUid(uid, data, callback){
    this.db.updateOne({uid: uid}, data, callback);
  }
}

export default new ThankyouModel;