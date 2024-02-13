import fs from 'fs';


export default class ProductManager {
    #url= "https://las_fotos.com/";
    constructor(path) {
        this.path = path;
        console.log("Este es el path: ", this.path)
        
    }

    async getProducts() {

        const data = await fs.promises.readFile(this.path, 'utf-8');
        const productos = JSON.parse(data);
        //console.log("Lista de todos los productos: ", productos);

        return productos
    }

    async generarId() {
        let index = 0;
        const productos = await this.getProducts();
        
        if (!productos.length){
         return index = 1;
        }
        index = productos.pop().id +1;
        console.log("Id generado: ", index)
        return index;
    }
    
    
    async addProduct(producto) {
        const productos = await this.getProducts();
        console.log("🚀 ~ ProductManager ~ addProduct=async ~ productos:", productos)
        
        if (productos) {
            producto.id = await this.generarId(); 
            producto.thumbnail = this.#url + producto.thumbnail;
        }
        else {
            producto.id = 1;
            producto.thumbnail = this.#url + producto.thumbnail;
        }
        productos.push(producto);
        console.log("Producto agregado: ", productos)
        await fs.promises.writeFile(this.path, JSON.stringify(productos, null, "\t"));
    }

    
    async getProductById(id) {
        const productos = await this.getProducts();
        const producto_buscado = productos.find ((producto) => producto.id === id);
        if (!producto_buscado) {
            console.log ("Product NOT FOUND");
            throw (error);
        }
        else {
            console.log("Producto buscado por id: ", producto_buscado);
            return producto_buscado;  
        }
    }

    async updateProduct(producto_a_actualizar) {

        const producto_buscado = await this.getProductById(producto_a_actualizar.id);
        if (producto_buscado) {
            const productos = await this.getProducts();
            let index = productos.findIndex((producto) => producto.id === producto_buscado.id)
            for (let key in producto_a_actualizar) {
                productos[index][key] = producto_a_actualizar[key];
            }
            console.log("Con producto actualizado: ", productos);
            await fs.promises.writeFile(this.path, JSON.stringify(productos, null, "\t"));
        }
        else {
            console.log ("Product NOT FOUND");
            throw (error);
        }
    }

    async deleteProduct(id) {
        const nuevo_array = [];
        const producto_buscado = await this.getProductById(id);
        if (producto_buscado) {
            const productos = await this.getProducts();
            let index = productos.findIndex((producto) => producto.id === producto_buscado.id)
            for (let i=0; i< productos.length; i++) {
                if (i === index) {
                    continue;
                }
                else {
                    nuevo_array.push(productos[i]);
                }
            }
            console.log("Con producto borrado: ", nuevo_array);
            await fs.promises.writeFile(this.path, JSON.stringify(nuevo_array, null, "\t"));
        }
        else {
            console.log ("Product NOT FOUND");
            throw (error);
        }
    }
}