Asunciones sobre el documento funcional
1)No se encontro informacion en la documentacion que indique de donde obtener el campo author en las llamadas a la API. Frente a esto, se asumio llenarlo con los datos del autor del codigo (Emiliano Tortorelli).

2)El listado de categorias no siempre retorna valores. Esto depende de lo que se indique en el campo de busqueda. Observando la pagina de mercadolibre.com, se noto que esto tambien sucede. Debido a esto, solo se vera el breadcrumb de categorias cuando las hubieren.

3)El campo "condition" de la api de mercadolibre retorna valores en ingles (tales como "used" o "new"). Estos fueron traducidos al español para que se asemejen a los mockups.

4)En el mockup de resultado de la busqueda, en la seccion derecha se puede ver la ubicacion del vendedor (por ejemplo, "Capital Federal"). Este campo NO fue requerido retornar del servidor que fue pedido armar. Aun asi, se asumio que este campo era necesario y fue agregado.

5)Sobre la descripcion del producto, se encontraron dos campos que proporcionan descripcion. "plain_text" y "text". El primero es simil a los mockups que se me dieron, pero "text" es un HTML. Dado que en algunas publicaciones de mercadolibre el campo "plain_text" viene vacio, se asumio que, en esos casos, debera mostrarse el campo "text" en su lugar.