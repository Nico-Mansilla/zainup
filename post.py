import requests

url = 'https://zainup.duckdns.org/login'  # URL de la ruta de registro en tu servidor
data = {
    'username': 'usuario_prueba',
    'password': 'contraseña_prueba'
}

# Realizar la solicitud POST y esperar la respuesta
try:
    response = requests.post(url, json=data)
    response.raise_for_status()  # Generar una excepción para errores HTTP (opcional)
    print(f'Status code: {response.status_code}')
    print('Response JSON:')
    print(response.json())  # Imprimir la respuesta JSON del servidor
except requests.exceptions.RequestException as e:
    print(f'Error en la solicitud: {e}')
