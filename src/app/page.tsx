"use client";

import { useState, useEffect } from "react";

import Button from 'react-bootstrap/Button';

import Image from "next/image";
import styles from "./page.module.css";
import TextField from "@mui/material/TextField";
import Table from "react-bootstrap/Table";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

function randomInteger(min: number, max: number): string {
  // случайное число от min до (max+1)
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand).toString();
}

interface Predict {
  prediction1: string;
  prediction2: string;
}

export default function Home() {
  const data = getData();

  const [predict, setPredict] = useState<Predict>();
  const [isLoading, setLoading] = useState(true);

  const [text, setText] = useState(data.report);

  const [file, setFile] = useState();

  const [randNum, setRandNum] = useState("");

  useEffect(() => {
    setRandNum(randomInteger(0, 4).toString());
    var header = new Headers();

    // Your server does not currently allow this one
    header.append("Content-Type", "application/json;charset=utf-8");

    fetch("http://80.87.109.214:5000/predict_text", {
      method: "POST",
      // mode: "no-cors",
      // headers: header,
      body: JSON.stringify({ text: data.report }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPredict(data);
        setLoading(false);
      });
  }, []);

  const renderListOfArray = (items: string[]) => {
    return items.map((item: string, index: number) => {
      const rand: number = 0 + Math.random() * (4 + 1 - 0);
      const stringRand: number = Math.floor(rand);

      //const rand: string = randomInteger(0, 4);
      const description: any = ratingDescriptions[stringRand];

      return (
        <tr key={index}>
          <td>{item}</td>
          <td style={{ color: description.color }}>{description.text}</td>
        </tr>
      );
    });
  };

  const ratingDescriptions: Object[] = [
    {
      color: "red",
      text: "Очень низкий",
    },
    {
      color: "red",
      text: "Низкий",
    },
    {
      color: "",
      text: "Средний",
    },
    {
      color: "green",
      text: "Высокий",
    },
    {
      color: "green",
      text: "Очень высокий",
    },
  ];

  const handleClick = async () => {
    setLoading(true);

    await fetch("http://80.87.109.214:5000/predict_text", {
      method: "POST",
      // mode: "no-cors",
      // headers: header,
      body: JSON.stringify({ text: text }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPredict(data);
        setLoading(false);
      });
  }

  const sendFile = async (e: any) => {
    setLoading(true);
    let files = e.target.files;

    setFile(files[0]);

    const formData = new FormData();
    formData.append("file", files[0], files[0].name);

    await fetch("http://80.87.109.214:5000/upload", {
      method: "POST",
      // mode: "no-cors",
      // headers: header,
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setPredict(data);
        setLoading(false);
      });
  }

  return (
    <main className={styles.main}>
      <Container className="p-5">
        <Row className="mb-3">
          <Col className="bordered">
            <h3 className="mb-0">
              <Row className="justify-content-between">
                {/* <Col xs="4">{data.company}</Col> */}
                <Col xs="4" >Рейтинг: <span style={{ color: "green" }}>{predict ? predict.prediction1[0] : ''}</span></Col>
              </Row>
              
              
            </h3>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            {/* <Row className="mb-3">
              <Col className="bordered">
                <h3>{data.company} <span style="color: green">{data.rating}</span></h3>
              </Col>
            </Row> */}
            <Row>
              <Col>
                <Tabs
                  defaultActiveKey="text"
                  id="uncontrolled-tab-example"
                  className="mb-3"
                >
                  <Tab eventKey="text" title="Текст">
                    <Form.Control
                      as="textarea"
                      rows={19}
                      value={text}
                      onChange={e => setText(e.target.value)}
                    ></Form.Control>
                    <Button variant="primary"
                    disabled={isLoading}
                    onClick={handleClick}
                    >Отправить</Button>
                  </Tab>
                  <Tab eventKey="file" title="Файл">
                    <Form.Group controlId="formFileLg" className="mb-3">
                      <Form.Label>Выберите файл</Form.Label>
                      <Form.Control type="file" size="lg" value={file} onChange={e => setText(e.target.value)}/>
                      <Button variant="primary"
                    disabled={isLoading}
                    onClick={sendFile}
                    >Отправить</Button>
                    </Form.Group>
                  </Tab>
                </Tabs>
              </Col>
            </Row>
          </Col>
          <Col sm={6}>
            <Row>
              {/* <Col sm={12} className="mb-2">
                <div className="bordered h-200 overflow-hidden">
                  <h2>Рейтинг</h2>
                  <h3>{data.rating} </h3>
                </div>
              </Col> */}
              <Col sm={12} className="mb-2">
                <div className="h-475 mt-5 overflow-scroll">
                  <Table striped bordered hover className="overflow-scroll">
                    <thead>
                      <tr>
                        <th>Критерий</th>
                        <th>Оценка</th>
                      </tr>
                    </thead>
                    <tbody>{renderListOfArray(data.criterias)}</tbody>
                  </Table>
                </div>
              </Col>
              <Col sm={6}>
                {/* <div
                  className="bordered h-400 overflow-hidden"
                  style={{ color: ratingDescriptions[randNum].color }}
                >
                  <h3>{ratingDescriptions[randNum].text}</h3>
                </div> */}
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </main>
  );
}

function getData() {
  // const res = await fetch('http://80.87.109.214:5000/test')
  // console.log(res.json());
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  const mockRes: {
    rating: string;
    company: string;
    criterias: string[];
    metricas: string[];
    report: string;
  } = {
    rating: "AAA",
    company: "ПАО Сбербанк",
    criterias: [
      "Выручка",
      "Рентабельность по EBIT",
      "EBITDA",
      "Рентабельность по EBITDA",
      "EBITDAR",
      "Рентабельность по EBITDAR",
      "Чистая прибыль",
      "Рентабельность по чистой прибыли",
      "FFO",
      "Рентабельность по FFO",
      "CFO",
      "CFI",
      "CFF",
      "FCF",
      "Рентабельность по FCF",
      "NFCF",
      "Скорректированные денежные средства",
      "Общий долг",
      "Чистый долг",
      "Скорректированный общий долг",
      "Скорректированный чистый долг",
      "Чистые процентные расходы",
      "Чистые процентные платежи",
      "Фиксированные платежи",
      "FFO до чистых процентных платежей",
      "FFO до фиксированных платежей",
      "Основные показатели оценки долговой нагрузки",
      "Основные показатели оценки обслуживания долга",
      "Краткосрочные финансовые вложения",
      "Неиспользованная часть краткосрочных кредитных линий",
      "Коэффициент краткосрочной ликвидности",
    ],
    metricas: ["Метрика 1", "Метрика 2"],
    report: `В своём стремлении улучшить пользовательский опыт мы упускаем, 
    что представители современных социальных резервов освещают чрезвычайно 
    интересные особенности картины в целом, однако конкретные выводы, разумеется, 
    функционально разнесены на независимые элементы. Высокий уровень вовлечения 
    представителей целевой аудитории является четким доказательством простого факта: 
    дальнейшее развитие различных форм деятельности способствует повышению качества 
    приоретизации разума над эмоциями. Идейные соображения высшего порядка, 
    а также глубокий уровень погружения требует определения и уточнения анализа 
    существующих паттернов поведения. И нет сомнений, что некоторые особенности внутренней 
    политики набирают популярность среди определенных слоев населения, 
    а значит, должны быть заблокированы в рамках своих собственных рациональных ограничений. 
    В целом, конечно, сплочённость команды профессионалов требует анализа глубокомысленных рассуждений. 
    Как принято считать, некоторые особенности внутренней политики, которые представляют собой яркий пример 
    континентально-европейского типа политической культуры, будут разоблачены. В рамках спецификации 
    современных стандартов, предприниматели в сети интернет формируют глобальную экономическую сеть и 
    при этом — обнародованы.`,
  };

  // if (!res.ok) {
  //   // This will activate the closest `error.js` Error Boundary
  //   throw new Error('Failed to fetch data')
  // }

  return mockRes;
}
