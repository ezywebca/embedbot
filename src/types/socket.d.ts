type Server = string
type Channel = string

export interface State {
  ip: string
  registered: boolean
  server: Server
  channel: Channel
  subscriptions: Set<Channel>
  typing:
    | {
        channel: string
        server: string
      }
    | false
}
