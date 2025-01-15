class MongoDAO {
  async findAll(collection) {
    // Lógica para buscar todos os documentos no MongoDB
    return collection.find().toArray();
  }

  async findById(collection, id) {
    // Lógica para buscar um documento por ID no MongoDB
    return collection.findOne({ _id: new mongoose.Types.ObjectId(id) });
  }

  async create(collection, data) {
    // Lógica para criar um novo documento no MongoDB
    const result = await collection.insertOne(data);
    return { id: result.insertedId, ...data };
  }

  async update(collection, id, data) {
    // Lógica para atualizar um documento no MongoDB
    await collection.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $set: data });
    return this.findById(collection, id);
  }

  async delete(collection, id) {
    // Lógica para excluir um documento no MongoDB
    await collection.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
    return true;
  }
}

module.exports = MongoDAO;