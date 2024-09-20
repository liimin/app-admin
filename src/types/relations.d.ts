declare module RelationsTypes {
  interface IRelation {
    id: number
    config_id: number
    user_field_id: number
  }
  type LogConfigUserFieldsRel = Omit<IRelation, 'id'>
}
