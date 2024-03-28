//                                                                        Table "public.notifications"
//        Column       |            Type             | Collation | Nullable |                  Default                  | Storage  | Compression | Stats target | Descriptio>
// --------------------+-----------------------------+-----------+----------+-------------------------------------------+----------+-------------+--------------+----------->
//  id                 | integer                     |           | not null | nextval('notifications_id_seq'::regclass) | plain    |             |              |
//  user_id            | uuid                        |           | not null |                                           | plain    |             |              |
//  type               | character varying(255)      |           | not null |                                           | extended |             |              |
//  message            | text                        |           |          |                                           | extended |             |              |
//  created_at         | timestamp without time zone |           |          | CURRENT_TIMESTAMP                         | plain    |             |              |
//  read_status        | boolean                     |           |          | false                                     | plain    |             |              |
//  user_thought_id    | uuid                        |           |          |                                           | plain    |             |              |
//  linking_thought_id | uuid                        |           |          |                                           | plain    |             |              |
//  linking_user_id    | uuid                        |           |          |                                           | plain    |             |              |
// Indexes:
//     "notifications_pkey" PRIMARY KEY, btree (id)
//     "unique_user_thought_link" UNIQUE CONSTRAINT, btree (user_id, user_thought_id, linking_user_id, linking_thought_id)
// Access method: heap

// Type definitions for the notifications table
export interface Ping {
  id: number;
  user_id: string;
  type: string;
  message: string;
  created_at: string;
  read_status: boolean;
  user_thought_id: string;
  linking_thought_id: string;
  linking_user_id: string;
}
