# angular-gridview
Quick and simple Grid with angularJs

#### install using npm 
`npm install angular-gridview`

#### usage 
Example of users grid
```
<table class="table table-striped" data-cii-grid="{autoLoad:true}" data-cii-grid-select-method="vm.select(sortExpression,pageIndex,pageSize)">
    <thead>
        <tr>
            <th>
                <a data-cii-grid-sortexpression="Id">
                    Id
                </a>
            </th>
            <th>
                <a data-cii-grid-sortexpression="Username">
                    Username

                </a>
            </th>
        </tr>
    </thead>
    <tbody>
        <tr data-cii-grid-data-template>
            <td>
                {{item.Id}}
            </td>
            <td>
                {{item.Username}}
            </td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <td colspan="10">
                <ul class="pagination" data-cii-grid-data-pager="container">
                    <li>
                        <a data-cii-grid-data-pager="first"></a>
                    </li>
                    <li>
                        <a data-cii-grid-data-pager="prev"></a>
                    </li>
                    <li>
                        <a data-cii-grid-data-pager="numeric"></a>
                    </li>
                    <li>
                        <a data-cii-grid-data-pager="next"></a>
                    </li>
                    <li>
                        <a data-cii-grid-data-pager="last"></a>
                    </li>
                </ul>
            </td>
        </tr>
    </tfoot>
</table>
```
definition attributes 


*cii-grid*  
[Required] this is the actual directive that creates the magic  you can just put it or you can add the options you want. available options are: 
```
{
  allowPagging:  false,
  allowSorting:  false,
  autoLoad:  false,
  pageSize:  10,
  visiblePageNumbers :  10
}
```

*cii-grid-select-method*

[Required] set a method that will be called each time the grid need to be populated with data like.
when view is first displayed (if autoload is true), when sorting needed or when paging is needed. 

method must return a promise, with the needed data as promise parameter. 
method parameter can be sortExpression, pageIndex, pageSize 
all parameters are optional.


**Header**

*data-cii-grid-sortexpression* 

[Optional] can be added to any element that is allowed to be clicked. once clicked. 
will take a sort expression as parameter (e.g. "Id",  "Id desc" , "Name desc, Id") 


**Body**

this part is the template that will be repeated.cii-grid-select-method

*data-cii-grid-data-template* 

must be added to indicate the element that will be repeated. 
inside it you can access the "item" which is a single object from within the array. 


**Paging**

*data-cii-grid-data-pager* 

must have a value from below 

1. container: the paging container, whill be hidden if no pagges needed. 
2. first  : go to the first page, will be hidden if it is the first page
3. prev : go to the previous page, will be hidden if no previous page exists 
4. numeric: a maximum of {visiblePageNumbers} visible page number including the current page. 
5. next : go to the next page, will be hidden if no next page exists.
6. last : go to the last page, will be hidden if it is the last page. 
