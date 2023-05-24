import fs from 'fs'

export default class ProductManager {
    //Inicia desde un constructor
    constructor(path){
        this.products = [];
        this.path = path
    }

    //Aumentar automáticamente Id
    generateId() {
        if (this.products.length > 0) {
            const prodCode = this.products [this.products.length - 1];
            this.code = prodCode.code + 1;
        } else {
            this.code = 1;
        }
        return this.code;
    }

    //Agregar método añadir producto
    addProduct({title='', description='', price='', thumbnail='', code='', stock='0'} = {}) {
        //Verificar que estén todos los datos
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Completar todos los datos solicitados");
            return;
        }
        //Nuevo producto
        const newProduct = {id: this.generateId(), title, description, price, thumbnail, code, stock};
        this.products.push(newProduct);
        fs.writeFileSync (this.path, JSON.stringify(this.products), "utf8");
    }        
    
    //Agregar método "obtener producto" y devolver array
    getProduct() {
        try {
            const data = fs.readFileSync (this.path, "utf-8");
            const products= JSON.parse(data);
            return products;
        } catch (err) {
            console.error(err);
            return [];
        }
    }
    
    //Agregar método "obtener producto Id" y devolver en objeto
    getProductById(code){
        //Repito proceso
        const data = fs.readFileSync (this.path, "utf-8");
        const products= JSON.parse(data);
        //Busco producto por código
        const product= products.find((prod) => prod.code === code);
        if(product) {
            return product;
        }else{
            console.log(`Código ${code} no encontrado.`);
            return null;
        }
    }

    //Agregar método "actualizar producto" con Id
    updateProduct( code, {title, description, price, thumbnail, stock } = {}) {
        const prodMg = this.products.findIndex((prod) => prod.code === code);
        if (prodMg === -1){
           console.log(`Código ${code} no encontrado`);
        }else {
           const product= this.products[prodMg];
           product.title= title || product.title;
           product.description= description || product.description;
           product.price= price || product.price;
           product.thumbnail= thumbnail || product.thumbnail;
           product.stock= stock || product.stock;
           this.products[prodMg] = product;
           fs.writeFileSync(this.path, JSON.stringify(this.products), "utf8")
           console.log(`Código ${code} actualizado.`);
        }
    }

    //Agregar método "borrar producto" con Id
    deleteProduct(code) {
        fs.readFile(this.path, "utf8", (err, data) => {
            if (err) {
                console.log(`Error en el archivo ${err}`);
                return;
            }
                
            let products = JSON.parse(data);
            const prodMg = products.findIndex((prod) => prod.code === code);
                
            if (prodMg === -1) {
                console.log(`Código ${code} no encontrado`);
            }else{
                products.splice(prodMg, 1);
                console.log(`Código ${code} eliminado`);

                fs.writeFile(this.path, JSON.stringify(products), (err) => {
                    if (err) {
                        console.log(`Error en el archivo: ${err}`);
                    }
                });
            }
        })
    }
}

//Agregar los productos

const productMg = new ProductManager("./productos.json");

productMg.addProduct({
    title:"La Cenicienta",
    description:"Basada en cuento de hadas, disney año 2014",
    price: 1000, 
    thumbnail:"Imagen1",
    code:"123",
    stock: 5 });
productMg.addProduct({
    title:"BlancaNieves y el cazador", 
    description:"Basada en cuentos de hadas, disney año 2012", 
    price: 1500,
    thumbnail: "Imagen2",
    code: "345",
    stock: 10});
productMg.addProduct({
    title:"Red riding hood",
    description: "Basada en cuentos de hadas, caperucita roja, disney año 2011",
    price: 1200,
    thumbnail: "Imagen3",
    code: "678",
    stock: 9});
productMg.addProduct({
    title:"Los tres chanchitos",
    description: "Basada en cuentos de hadas, disney año 1993",
    price: 700,
    thumbnail: "Imagen4",
    code: "912",
    stock: 15});
productMg.addProduct({
    title:"Guillermo del Toro's Pinocchio",
    description: "Basada en cuentos de hadas, disney año 2022",
    price: 1500,
    thumbnail: "Imagen5",
    code: "234",
    stock: 4});
productMg.addProduct({
    title:"Peter Pan & Wendy",
    description:"Aventuras de fantasía americana, disney año 2023",
    price:2500,
    thumbnail:"Imagen7",
    code:"973",
    stock:25})
productMg.addProduct({
    title:"Mickey: The story of a Mouse",
    description:"Documental sobre la historia de un ratón, disney año 2022",
    price:1000,
    thumbnail:"Imagen8",
    code:"502",
    stock:21 })
productMg.addProduct({
    title:"Lightyear",
    description:"Ciencia ficción animada, disney año 2022",
    price:1100,
    thumbnail:"Imagen9",
    code:"298",
    stock:12})
productMg.addProduct({
    title:"Mulan",
    description:"Fantasía de acción y drama americano, disney año 2020",
    price:950,
    thumbnail:"Imagen10",
    code:"009",
    stock:27})

//Productos agregados hasta el momento
const products = productMg.getProduct();
console.log(products);

//Productos por código
const prod= productMg.getProductById("912");
console.log(prod);

//Producto no existente por código
const prodNotFound = productMg.getProductById("123a")
console.log(prodNotFound);

//Producto a modificar por código
productMg.updateProduct("234", {
    title: "Pinocho y gepetto",
    description: "Basada en cuentos de hadas, disney año 1999",
    price: 800,
    thumbnail: "Imagen6",
    stock: 20
});