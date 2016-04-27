# Cardify
Cardify transforms generic json data into a fully styled, evented, and markedup UI Card for a stunning visual display. 

```
var cardify = new Cardify(data,options);
```
![alt text](https://github.com/Logicium/Cardify/blob/master/Cardify/Cardify%20Alpha.PNG "Cardify Demo image")

Data - Format your data
```
data = [
    {key: 'Image', value:'http://blog.rsir.com/wp-content/uploads/2014/09/Olives-and-Olive-Oil.jpg'},
    {key:'Name', value:'Avocado'},
    {key:'Expiration', value:'12.16.16'},
    {key:'Days Remaining',value:'10',iconMarkup:''},
    {key:'Date Acquired',value:'4.11.16'},
    //If we want hidden values, just add that flag to the data
    //{key:'',value:'',hidden:'true'},
];
```

Options - Where will Cardify send data
``` 
var options = {
                postNewAddress:"",
                //getAllAddress:"http://localhost:2080/getAll",
                postDeleteAddress:"http://localhost:2080/postDelete",
                postEditAddress:"http://localhost:2080/postEdit",
                cardsLocation:"cards-container"//Appends the card to the element with this class
};
```

