import express from 'express';
import ProductManager from './ProductManager';

const app= express();

//Creo instancia
const productManager= new ProductManager('./productos.json');

//Setting
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.set('port', process.env.PORT || 8080);

const routerProducts= express.Router();
const routerCart= express.Router();

app.use('/api/productos', routerProducts);
app.use('/api/carrito', routerCart);

//Authorization
const authOrNot= app.use((req,res,next) => {
    req.header('authorization') == Process.env.PORT ? next() : res.status(401).json({"error": "unauthorized"})
})

/*-------------------------- Endpoints-----------------------------*/

//GET -> api/productos
routerProducts.get('/', async (req, res) =>{
    const products= await ProductManager.getProduct();
    res.status(200).json(products);
})

//GET -> api/productos/:id
routerProducts.get('/:id', async (req, res) =>{
    const {id} = req.params
    const ids= await productManager.getProductById(id);
    !ids?.code ? res.status(200).json(ids) : res.status(400).json ({"error": "Product not found"});
});

//POST -> api/productos
routerProducts.post('/', authOrNot, async (req,res,next) => {
    const {body} = req;
    body.timestamp = Date.now();
    const newProdId= await productManager.save(body);
    newProdId? res.status(200).json({"sucess" : "Product added, ID:" + newProdId}) : res.status(400).json({"error": "Verify it again"})
})

//PUT -> api/productos/:id
routerProducts.put('/:id', authOrNot, async (req, res, next) =>{
    const {id}= req.params;
    const {body}= req;
    const update= await productManager.updateById(id,body);
    update? res.status(200).json({"success": "Product updated"}) : res.status(404).json ({"error": "Product not found"})
})

//DELETE -> api/productos/:id
routerProducts.delete('/:id', authOrNot, async (req, res, next) =>{
    const {id}= req.params;
    const deleted= await productManager.deleteById(id);
    deleted? res.status(200).json({"success": "product removed"}) : res.status(404).json ({"error": "product not found"}) 
})





//Start the server
app.listen(app.get('port'), () => {
    console.log("Listening on port", app.get ('port'))
});


/*--------------------------Anterior------------------------------*/

//llamar al metodo getProduct
//app.get('/productos', async (req, res) =>{
   // const{limit}= req.query
   //const products= await productManager.getProduct();
   //!limit?res.send(products) : res.send(products.slice(0,limit));
//})

//Llamar al metodo getProductById
//app.get('/:id', async (req, res) =>{
    //const{id} = req.params
    //const ids= await productManager.getProductById(id);
    //!ids?.code ? res.send ({message:"Producto no encontrado"}) : res.send(ids);
//})