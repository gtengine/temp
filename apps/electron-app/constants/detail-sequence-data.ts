export const sequenceDiagramC = `
sequenceDiagram
    autonumber
    box rgb(215, 250, 248) 성능시험 프로그램
    participant Renderer
    participant Main
    end
    participant Wrapper
    participant C API
    participant libUSB
    participant Q-SoC
    Renderer->>Main: 성능 검증 요청
    Main->>Wrapper: 성능 검증 API 호출
    Wrapper->>Wrapper: 시작 시간 측정
    Wrapper->>C API: C API 호출
    rect rgb(191, 223, 255)
    note right of C API: 성능 측정 구간
    C API->>Q-SoC: Trans out
    Q-SoC->>C API: Trans in
    end
    C API->>Wrapper: C API 호출 결과 반환
    Wrapper->>Wrapper: 종료 시간 측정
    Wrapper->>Main: API 결과 반환
    Main->>Renderer: 성능 검증 결과
`;

export const sequenceDiagramJS = `
sequenceDiagram
    autonumber
    box rgb(215, 250, 248) 성능시험 프로그램
    participant Renderer
    participant Main
    end
    participant JS API
    participant libUSB
    participant Q-SoC
    Renderer->>Main: 성능 검증 요청
    Main->>Main: 시작 시간 측정
    Main->>JS API: 성능 검증 API 호출
    rect rgb(191, 223, 255)
    note right of JS API: 성능 측정 구간
    JS API->>Q-SoC: Trans out
    Q-SoC->>JS API: Trans in
    end
    JS API->>Main: C API 호출 결과 반환
    Main->>Main: 종료 시간 측정
    Main->>Renderer: 성능 검증 결과
`;
