#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProductsAppStack } from '../lib/productsApp-stack';
import { ECommerceApiStack } from '../lib/ecommerceApi-stack';

const app = new cdk.App();

const env: cdk.Environment = {
  account: "767828725488", //conta que será utilizada
  region: "us-east-1" //região da conta
}

const tags = {
  cost: "ECommerce", //centro de custo
  team: "SiecolaCode" //time desenvolvedor
}

const productsAppStack = new ProductsAppStack(app, "ProductsApp", {
  tags: tags,
  env: env //variavel que contem os dados para acesso
})

const eCommerceApiStack = new ECommerceApiStack(app, "ECommerceApi", {
  productsFetchHandler:productsAppStack.productsFetchHandler, //passando a instância da função para dentro da constante que cria o api gateway
  tags: tags,
  env: env
})
eCommerceApiStack.addDependency(productsAppStack)