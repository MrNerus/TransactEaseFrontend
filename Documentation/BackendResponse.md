Standard Response fromat from Backend:
{
    "message": "Success / Error Message",
    "status": 0,
    "data": <actual data>
}

get-all apis are apis that returns lis of data to display on dynamic table.
paginated data for get-all api:
{
    "totalCount": 4,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1,
    "data": [<array or object>]
}

following are the get-all apis:
api/cards/get-all
[[
  {
    "cardNumber": "string",
    "cardType": "string",
    "status": "string",
    "organizationId": 0,
    "userId": 0,
    "issueDate": "2025-12-15T01:00:30.277Z",
    "expiryDate": "2025-12-15T01:00:30.277Z",
    "cvv": "string"
  }
]]
api/cashback-schemes/get-all
[{
  "id": 0,
  "name": "string",
  "description": "string",
  "isActive": true,
  "rate": 0
}]
api/organization/get-all
[{
  "id": 0,
  "name": "string",
  "parentId": 0,
  "createdAt": "2025-12-15T00:59:35.926Z"
}]
api/staff/get-all
[{
  "id": 0,
  "fullName": "string",
  "email": "string",
  "organizationId": 0,
  "role": "string",
  "isActive": true,
  "createdAt": "2025-12-15T01:01:18.433Z"
}]
api/transactions/get-all
[{
  "id": 0,
  "userId": 0,
  "receiverId": 0,
  "amount": 0,
  "createdAt": "2025-12-15T01:01:51.040Z",
  "cashbackId": 0,
  "organizationId": 0,
  "cashbackAmount": 0
}]
api/users/get-all
[{
  "id": 0,
  "fullName": "string",
  "email": "string",
  "organizationId": 0,
  "isActive": true,
  "createdAt": "2025-12-15T01:02:15.208Z"
}

following is backend model as optional input parameter (takes in SearchRequest) to gat-all apis to allow search and paginate stuff.
public class FilterCondition
{
    public required string Field { get; set; }
    public required string Operator { get; set; }
    public required dynamic Value { get; set; }
}

public class FilterPayload
{
    public string Logic { get; set; } = "or"; // "and" | "or"
    public required List<FilterCondition> Conditions { get; set; }
}

public class Paging
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class SearchRequest
{
    public FilterPayload? Filter { get; set; }
    public Paging Pagination { get; set; } = new();
}

for now, each "create" api is a post api that receives payload as same as get-all output, except created_at / timestamp / id. these are calculated by db. this api is Post Request..
/api/cashback-schemes/create
/api/organization/create
/api/staff/create
/api/transactions/create
/api/users/create

api/create/cards is a exception. it accepts list of objects instead of object.
also, create-option has only few parameters unlike the get-all counterpart.
[
  {
    "cardNumber": "string",
    "cardType": "string",
    "cvv": "string"
  }
]

to get only one of data: for editing or viewing, following are the apis with exact same object as get-all api. nothing here is in list. this is Get Request
/api/cards/get/{cardNumber}
/api/cashback-schemes/get/{id}
/api/cards/get/{cardNumber}
/api/staff/get/{id}
/api/transactions/get/{id}
/api/users/get/{id}

update receives same payload as get one. including id except created_at and timestamp. this is put request.
/api/cards/update
/api/cashback-schemes/update
/api/organization/update
/api/staff/update
/api/users/update
Transactions cannot be updated and card is not list. it is one object here.

same goes for delete. It is Http Delete Request:
/api/cards/delete/{cardNumber}
/api/cashback-schemes/delete/{id}
/api/organization/delete/{id}
/api/staff/delete/{id}
/api/users/delete/{id}
Transactrions cannot be deleted either.

Note: All responses comes as data on stabdard backend response. All listing-datas comes as paginated data.. always