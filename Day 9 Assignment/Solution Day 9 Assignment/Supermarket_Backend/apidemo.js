const http=require('http');
const fs=require('fs');
const url=require('url');


const productsString=fs.readFileSync("./products.json","utf-8");
const products=JSON.parse(productsString);


const server=http.createServer((req,res)=>{


    const path=url.parse(req.url,true);
    


    res.writeHead(200,{
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, PATCH, DELETE",
        "Access-Control-Allow-Headers":"*",
        "Content-Type":"application/json"
    });

    

    if(req.method=="OPTIONS"){

        res.end();
       
    } 

    
    if(path.pathname=="/" || path.pathname=="/products"){

        res.end(productsString);
        
    }
    else if(path.pathname=="/product"){

        
        if(req.method=="GET")
        {
            const id=path.query.id;

            const singleData=products.find((ele)=>{
                return ele.id==id;
            })
            res.end(JSON.stringify(singleData));
        }
        else if(req.method=="POST"){

            console.log("its working");


            let body="";
            req.on('data',(data)=>{
                body+=data;
            })

            req.on('end',()=>{
                let product=JSON.parse(body);
                console.log(product);
                products.push(product);
                fs.writeFile("./products.json",JSON.stringify(products),(err)=>{
                    res.end(JSON.stringify({message:"product added"}));
                });


            })

            

        }
        else if(req.method=="PUT"){
 
            const id=path.query.id;                            // product id

            let body="";                                        // product data
            req.on('data',(data)=>{
                body+=data;
            })

            req.on('end',()=>{
                let product=JSON.parse(body);


                products.forEach((ele)=>{
                    if(ele.id==id){

                        ele.title=product.title;
                        ele.type=product.type;
                        ele.description=product.description;
                        ele.price=product.price;
                        

                    }
                })

                 
                
                fs.writeFile("./products.json",JSON.stringify(products),(err)=>{

                    const updatedProduct=products.find((ele)=>{

                            return ele.id==id;
                    })

                    res.end(JSON.stringify(updatedProduct));
                });

                    


            })


        }
        else if(req.method=="DELETE"){

          
            const id=path.query.id;                                   // product id 

            products.forEach((ele,index)=>{
                if(ele.id==id){
                    products.splice(index,1);
                }
            })

            

            fs.writeFile("./products.json",JSON.stringify(products),(err)=>{
                res.end(JSON.stringify({message:"product deleted"}));
            });


        }
        
        
      
    }
    else if(path.pathname=="/updateRating"){

        
        if(req.method=="PUT"){

         
            const id=path.query.id;               // product id
            console.log(id);

            let body="";                        // product data
            req.on('data',(data)=>{
                body+=data;
            })

            req.on('end',()=>{
                let product=JSON.parse(body);
            


            products.forEach((ele)=>{
                if(ele.id==id){

                   ele.rating=Number(ele.rating)+Number(product.rating);
                   ele.rating_count=Number(ele.rating_count)+1;
                    

                }
            })

             
            
            fs.writeFile("./products.json",JSON.stringify(products),(err)=>{

                const updatedProduct=products.find((ele)=>{

                        return ele.id==id;
                })

                res.end(JSON.stringify(updatedProduct));
            });

        });


    }



    }
    else {
        res.writeHead(404,{
            "Content-Type":"application/json"
        });
        res.end(JSON.stringify({message:"Not Found anything for this URL"}));
    }

    

});

server.listen("3000","127.0.0.1",()=>{
    console.log("server is running");
})


