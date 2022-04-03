//класс для хранения данных о товаре
class Good {

    constructor(id, name, description, sizes, price, available) {
        this.id = id;       //Код товара
        this.name = name;       //Наименование
        this.description = description;     //Описание
        this.sizes = sizes;     //массив возможных размеров
        this.price = price;     //цена товара
        this.available = available;        //Признак доступности для продажи
    }

    //изменение признака доступности для продажи
    set setAvailable(value) {
        this.available = value;
    }
};


const skiBlue = new Good(1, 'Лыжи синие', 'Для езды по снегу', [210, 220, 230], 512, true);
const feltBoots = new Good(2, 'Валенки', 'Для ходьбы по снегу', [42, 46], 364, true);
const ushanka = new Good(7, 'Ушанка', 'Гулять зимой', [35, 36, 38], 612, true);
const skiWax = new Good(8, 'Мазь лыжная', 'Мазать лыжи', ['синяя', 'жёлтая', 'красная'], 97, true);
const skiPoles = new Good(11, 'Палки', 'Без них на лыжах плохо', [130], 200, true);
const skiRed = new Good(22, 'Лыжи красные', 'Для езды по снегу', [210, 215, 230], 533, true);


skiBlue.setAvailable = false;
skiPoles.setAvailable = false;


//класс для хранения каталога товаров
class GoodsList {

    #goods;     //массив экземпляров объектов класса Good (приватное поле)

    constructor(good, sortPrice = false, sortDir = true) {
        this.#goods = [good];
        this.filter = 0;        //регулярное выражение используемое для фильтрации товаров по полю name
        this.sortPrice = Boolean(sortPrice);        //булево значение, признак включения сортировки по полю Price
        this.sortDir = Boolean(sortDir);        //булево значение, признак направления сортировки по полю Price (true - по возрастанию, false - по убыванию)
    }

    //добавление товара в каталог
    addGood(items) {
        items.forEach(element => this.#goods.push(element));
    }

    //регулярное выражение используемое для фильтрации товаров по полю name
    set setFilter(filterValue) {
        let regexp = new RegExp(`${filterValue}`, 'gi');
        this.filter = regexp;
    }

    //возвращает массив доступных для продажи товаров в соответствии с установленным фильтром
    //и сортировкой по полю Price
    get list() {

        let filteredGoods;

        if (this.filter.test('все')) {
            filteredGoods = this.#goods.filter(good => good.available === true);
        } else {
            filteredGoods = this.#goods.filter(good => good.available === true && this.filter.test(good.name));
        }

        if (this.sortPrice) {
            return filteredGoods
                .sort(this.sortDir
                    ? ((a, b) => a.price - b.price)
                    : ((a, b) => b.price - a.price));

        } else {
            return filteredGoods;
        }
    }

    //удаление товара из каталога по его id
    remove(id) {
        let goodIndex = this.#goods.findIndex(item => item.id === id);
        this.#goods.splice(goodIndex, 1);
    };
};


//класс дочерний от Good, для хранения данных о товаре в корзине с дополнительным свойством
class BasketGood extends Good {
    constructor(good, amount) {
        super(good.id, good.name, good.description, good.sizes, good.price, good.available);
        this.amount = amount;       //количество товара в корзине
    }
}


//класс для хранения данных о корзине товаров
class Basket {

    goods;      //массив объектов класса BasketGood для хранения данных о товарах в корзине

    constructor(good, amount) {
        this.goods = [new BasketGood(good, amount)];
    }

    //Добавляет товар в корзину, если товар уже есть увеличивает количество
    add(good, amount) {
        let itemIndex = this.goods.findIndex(item => item.id === good.id);
        if (itemIndex === -1) {
            this.goods.push(new BasketGood(good, amount));
        } else {
            this.goods[itemIndex].amount += amount;
        }
    }

    //Уменьшает количество товара в корзине, если количество становится равным нулю, товар удаляется
    remove(good, amount) {
        let itemIndex = this.goods.findIndex(item => item.id === good.id);
        // console.log(item);
        if ((this.goods[itemIndex].amount - amount) > 0) {
            this.goods[itemIndex].amount -= amount;
        } else {
            this.goods.splice(itemIndex, 1);
        }
    }

    //возвращает общее количество товаров в корзине
    get totalAmount() {
        return this.goods.reduce((sum, current) => sum + current.amount, 0);
    }

    //возвращает общую стоимость товаров в корзине
    get totalSum() {
        let sum = 0;
        this.goods.forEach(item => sum += item.amount * item.price);
        return sum;
    }

    //очистка корзины
    clear() {
        this.goods.length = 0;
    }

    //Удаляет из корзины товары, имеющие признак available === false (использовать filter())
    removeUnavailable() {
        this.goods = this.goods.filter(item => item.available === true);
        return this.goods;
    }

}



const goodsList = new GoodsList(skiBlue);
goodsList.addGood([feltBoots, ushanka, skiWax, skiPoles, skiRed, skiBlue]);
goodsList.setFilter = 'лыжи';
goodsList.sortPrice = true;
goodsList.sortDir = false;
console.log('Фиьтрованный и сортированый список :\n', goodsList.list);
goodsList.remove(7);


const basket = new Basket(feltBoots, 3);
basket.add(feltBoots, 2);
basket.add(skiWax, 1);
basket.add(skiBlue, 1);
basket.remove(feltBoots, 4);
basket.remove(feltBoots, 1);
// basket.clear();
basket.removeUnavailable()
console.log('Количество товаров в корзине: ', basket.totalAmount);
console.log('Сумма всех товаров в корзине: ', basket.totalSum);
