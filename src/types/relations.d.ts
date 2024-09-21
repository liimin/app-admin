declare namespace RelationsTypes {
  interface IRelation extends CommonTypes.IId {
    config_id: number
    user_field_id: number
  }
  type LogConfigUserFieldsRel = Omit<IRelation, 'id'>
}
