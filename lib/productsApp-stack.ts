import * as lambda from "aws-cdk-lib/aws-lambda"

import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"

import * as cdk from "aws-cdk-lib"

import { Construct } from "constructs"
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"

export class ProductsAppStack extends cdk.Stack {
    readonly productsFetchHandler: lambdaNodeJS.NodejsFunction
    readonly productsDdb: dynamodb.Table //criando uma classe para a tabela dynamoDB

    constructor(scope: Construct, id: string, props?: cdk.StackProps){
        super(scope, id, props)

        this.productsDdb = new dynamodb.Table(this, "ProductsDdb", {
            tableName: "products",
            removalPolicy: cdk.RemovalPolicy.DESTROY, //faz com que os dados do banco sejam destruidos caso excluirmos as stacks
            partitionKey: {
                name: "id",
                type: dynamodb.AttributeType.STRING, 
            },
            billingMode: dynamodb.BillingMode.PROVISIONED,
            readCapacity: 1,
            writeCapacity: 1
        })

        this.productsFetchHandler = new lambdaNodeJS.NodejsFunction(this,
            "ProductsFetchFunction", {
                runtime: lambda.Runtime.NODEJS_20_X,
                functionName: "ProductsFetchFunction",
                entry: "lambda/products/productsFetchFunction.ts",
                handler: "handler",
                memorySize: 512,
                timeout: cdk.Duration.seconds(5),
                bundling: {
                    minify: true,
                    sourceMap: false
                },
                environment: {
                    PRODUCTS_DDB: this.productsDdb.tableName // capturando o nome da tabela e adicionando a variável
                }
            }
        )

        this.productsDdb.grantReadData(this.productsFetchHandler) //dando permissão de ler os dados do banco para a função de procurar produtos
    }
}