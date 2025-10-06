'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Categorias',[
      {
        nome: 'Bad Bunny',
        premio: 'Melhor compositor',
        data: new Date('2025-03-10'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Liniker',
        premio: 'Melhor artista',
        data: new Date('2025-07-03'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categorias',null,{});
  }
};