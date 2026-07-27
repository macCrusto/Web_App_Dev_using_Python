from db import get_connection

def db_execute(query):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(query)
    res = cur.fetchall()
    cur.close()
    conn.close()
    return res

