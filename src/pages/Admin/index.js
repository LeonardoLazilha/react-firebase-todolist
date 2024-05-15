import { useState, useEffect } from "react";
import { auth, db } from "../../firebaseConnection";
import { signOut } from "firebase/auth";
import {
  addDoc,
  doc,
  collection,
  onSnapshot,
  deleteDoc,
  query,
  orderBy,
  where,
  updateDoc,
} from "@firebase/firestore";

import "./admin.css";

export default function Admin() {
  const [taskInput, setTaskInput] = useState("");
  const [user, setUser] = useState("");
  const [task, setTask] = useState([]);
  const [edit, setEdit] = useState("");

  //Read
  useEffect(() => {
    async function loadTasks() {
      const userDetail = localStorage.getItem("@detailUser");
      setUser(JSON.parse(userDetail));

      if (userDetail) {
        const data = JSON.parse(userDetail);
        const taskRef = collection(db, "tasks");
        const q = query(
          taskRef,
          orderBy("created", "desc"),
          where("userUid", "==", data?.uid)
        );

        const unsub = onSnapshot(q, (snapshot) => {
          let list = [];

          snapshot.forEach((doc) => {
            list.push({
              id: doc.id,
              task: doc.data().task,
              userUid: doc.data().userUid,
            });
          });

          console.log(list);
          setTask(list);
        });
        return unsub;
      }
    }

    loadTasks();
  }, []);

  //Create
  async function handleSave(e) {
    e.preventDefault();
    //verificar se tem algo no campo a ser inserido
    if (taskInput === "") {
      alert("O campo nao pode ser vazio");
      return;
    }

    if (edit?.id) {
      handleUpdateTask();
      return;
    }

    await addDoc(collection(db, "tasks"), {
      task: taskInput,
      created: new Date(),
      userUid: user?.uid,
    })
      .then(() => {
        console.log("Tarefa registrada");
        setTaskInput("");
      })
      .catch((error) => {
        console.log("Erro ao registrar" + error);
      });
  }

  //Update
  function editTask(item) {
    setTaskInput(item.task);
    setEdit(item);
  }

  async function handleUpdateTask() {
    const docRef = doc(db, "tasks", edit?.id);
    await updateDoc(docRef, {
      task: taskInput,
    })
      .then(() => {
        console.log("task atualizada");
        setTaskInput("");
        setEdit({});
      })
      .catch(() => {
        console.log("erro ao atualizar task");
        setTaskInput("");
        setEdit({});
      });
  }

  //Logout
  async function handleLogout() {
    await signOut(auth);
  }

  //Delete
  async function deleteTask(id) {
    const docRef = doc(db, "tasks", id);
    await deleteDoc(docRef);
  }

  return (
    <div className="admin-container">
      <h1>Minhas tarefas</h1>

      <form onSubmit={handleSave} className="form">
        <textarea
          placeholder="Digite sua tarefa"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        ></textarea>

        {Object.keys(edit).length > 0 ? (
          <button
            className="btn-save"
            type="submit"
            style={{
              backgroundColor: "#95CD97",
              transition: "background-color 0.3s ease",
            }}
          >
            Atualizar tarefa
          </button>
        ) : (
          <button
            className="btn-save"
            type="submit"
            style={{
              backgroundColor: "#5DD3F3",
              transition: "background-color 0.3s ease",
            }}
          >
            Salvar tarefa
          </button>
        )}
      </form>

      {task.map((item) => (
        <article key={item.id} className="list">
          <p>{item.task}</p>
          <div>
            <button onClick={() => editTask(item)}>Editar</button>
            <button className="btn-delete" onClick={() => deleteTask(item.id)}>
              Concluir
            </button>
          </div>
        </article>
      ))}

      <button className="logout" onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}
