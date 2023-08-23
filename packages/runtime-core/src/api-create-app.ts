export interface App<HostElement = any>{
  
}

export type CreateAppFunction<HostElement> = (
  // TODO
  rootComponent:unknown,
  rootProps?: null
) => App<HostElement>