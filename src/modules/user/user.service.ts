import { pool } from "../../config/db"


const getUsers=async()=>{
    const result=await pool.query(`SELECT  * FROM users`);
    return result;
}

const getUser = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
  return result;
};

const updateUser = async (name: string, email: string, phone: string, role: string | undefined, id: string) => {
  const query = role
    ? `UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *`
    : `UPDATE users SET name=$1, email=$2, phone=$3 WHERE id=$4 RETURNING *`;

  const values = role ? [name, email, phone, role, id] : [name, email, phone, id];

  const result = await pool.query(query, values);
  return result;
};


const deleteUser=async (id:string)=>{
    const result=await pool.query(`DELETE FROM users WHERE id=$1`, [id]);

    return result
}

export const userServices={
    getUsers,
    getUser,
    updateUser,
    deleteUser
}

