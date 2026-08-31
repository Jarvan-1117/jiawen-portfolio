import {
  Binary,
  BrainCircuit,
  ChartNoAxesCombined,
  Code2,
  Database,
  Eye,
  GraduationCap,
  HeartPulse,
  MessageSquareText,
  Workflow
} from "lucide-react";

export const projectIcons = {
  vision: Eye,
  symbols: Binary,
  healthcare: HeartPulse,
  nlp: MessageSquareText
};

export type Project = {
  id?: string;
  slug?: string;
  title: string;
  summary: string;
  description?: string;
  long_description?: string;
  year?: string;
  category?: string;
  cover_image?: string;
  gallery_images?: string[];
  project_url?: string;
  featured?: boolean;
  visible?: boolean;
  sort_order?: number;
  techStack: string[];
  tags: string[];
  icon: keyof typeof projectIcons;
  caseStudy: {
    problem: string;
    dataset: string;
    approach: string;
    models: string;
    evaluation: string;
    results: string;
    learned: string;
  };
};

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" }
];

export const projects: Project[] = [
  {
    title: "Deep Learning for Image Classification & Object Detection",
    summary:
      "Developed four PyTorch computer-vision experiments across 10-class image classification and object detection; a customized ResNet18 reached 92.43% test accuracy and SSD300 achieved 90.50% detection accuracy at IoU 0.5.",
    long_description:
      "A comparative deep-learning study covering transfer learning, architectural customization, regularization, and early stopping across image classification and object detection. The work evaluated a baseline ResNet18, a deeper customized variant, Faster R-CNN, and SSD300 using reproducible data splits and visual training diagnostics.",
    year: "2026",
    category: "Computer Vision / Deep Learning",
    gallery_images: [
      "/projects/deep-learning-classification-samples.png",
      "/projects/deep-learning-customized-cnn-curves.png",
      "/projects/deep-learning-detection-sample.png",
      "/projects/deep-learning-ssd300-loss.png"
    ],
    techStack: ["Python", "PyTorch", "TorchVision", "ResNet18", "Faster R-CNN", "SSD300"],
    tags: ["Computer Vision", "Deep Learning", "Transfer Learning", "Object Detection"],
    icon: "vision",
    caseStudy: {
      problem:
        "Build and compare reliable CNN workflows for multi-class image classification and object localization, then test whether architectural customization improves generalization on limited datasets.",
      dataset:
        "The classification dataset contains 10 dog-breed classes and was split 70%/15%/15% for training, validation, and testing using a fixed student-ID seed. Images were resized to 224 x 224 and normalized with ImageNet statistics. The detection dataset was pre-split and supplied in Pascal VOC, COCO, and YOLO formats; Pascal VOC annotations were used for the experiments.",
      approach:
        "Fine-tuned an ImageNet-pretrained ResNet18, then added a 512-channel convolutional block with batch normalization, ReLU, and 0.5 dropout for the customized classifier. For detection, adapted pretrained Faster R-CNN and SSD300 prediction heads to the dataset classes, trained with SGD, monitored validation loss, and saved the best checkpoint with early stopping.",
      models:
        "Baseline ResNet18 and a customized ResNet18 for 10-class classification; Faster R-CNN and SSD300 for object detection. Classification used Adam and CrossEntropyLoss, while both detectors used SGD with momentum 0.9 and weight decay 0.0005.",
      evaluation:
        "Compared classification test accuracy, detection accuracy at IoU = 0.5, training and validation loss curves, convergence behavior, and early-stopping epochs. Sample class images and annotated bounding boxes were also reviewed visually.",
      results:
        "The customized classifier improved test accuracy from 75.30% for baseline ResNet18 to 92.43%. For detection, SSD300 reached 90.50% accuracy at IoU = 0.5 and stopped at epoch 42, outperforming Faster R-CNN at 73.47%, which stopped at epoch 74. SSD300 also converged faster and maintained more stable validation loss on this dataset.",
      learned:
        "Transfer learning provided a strong starting point, but architecture changes and regularization materially improved classification generalization. The detector comparison also showed that a simpler single-stage model can outperform a two-stage pipeline when its speed and optimization behavior better match the dataset."
    }
  },
  {
    title: "Handwritten Mathematical Symbol Recognition",
    summary:
      "Compared HOG, LBP, and raw-pixel representations across RBF-SVM and MLP classifiers for 10 handwritten symbol classes; HOG with SVM achieved 99.3% test accuracy.",
    long_description:
      "A controlled computer-vision experiment examining how feature representation changes multi-class recognition performance. The same balanced handwritten-symbol dataset was evaluated with classical and neural classifiers using raw pixels, HOG shape descriptors, and LBP texture features.",
    year: "2026",
    category: "Computer Vision / Machine Learning",
    gallery_images: [
      "/projects/handwritten-model-comparison.png",
      "/projects/handwritten-svm-hog-confusion-matrix.png",
      "/projects/handwritten-sample-predictions.png"
    ],
    techStack: ["Python", "Scikit-learn", "HOG", "LBP", "SVM", "MLP"],
    tags: ["Computer Vision", "Feature Engineering", "SVM", "Neural Networks"],
    icon: "symbols",
    caseStudy: {
      problem:
        "Classify handwritten mathematical symbols despite writer-to-writer variation and visually similar stroke patterns, while determining which feature representation best preserves discriminative shape information.",
      dataset:
        "A balanced dataset of 10 handwritten symbol classes: +, 3, alpha, cos, div, f, ldots, lim, q, and right arrow. Every image was converted to grayscale, resized to 64 x 64 pixels, and split 80%/20% into training and test sets.",
      approach:
        "Generated three standardized feature representations: flattened raw pixels, Histogram of Oriented Gradients for edge and shape information, and Local Binary Patterns for local texture. Each representation was evaluated with the same two classifiers.",
      models:
        "An RBF-kernel Support Vector Machine with C = 10 and gamma = scale, plus a Multi-Layer Perceptron with 128- and 64-unit hidden layers, ReLU activations, Adam optimization, and up to 50 iterations.",
      evaluation:
        "Compared held-out test accuracy for all six classifier-feature combinations and inspected the best model's confusion matrix and sample predictions for class-specific errors.",
      results:
        "HOG produced the strongest results: 99.3% accuracy with SVM and 98.5% with MLP. Raw pixels reached 96.1% and 95.7%, while LBP fell to 61.2% and 59.1%. The SVM-HOG confusion matrix was nearly diagonal, with only a few errors among visually similar symbols such as + and f.",
      learned:
        "For small visual datasets, task-aligned feature engineering can outperform greater model complexity. HOG captured the structural information needed for symbol recognition, while texture-focused LBP discarded too much of the shape signal."
    }
  },
  {
    title: "Cardiovascular Disease Prediction",
    summary:
      "Cleaned and engineered features from approximately 56,000 anonymized health records, compared five classifiers, and selected a tuned Random Forest with an F1 score of 0.7316 and ROC-AUC of approximately 0.804.",
    long_description:
      "An end-to-end healthcare analytics project covering exploratory analysis, data cleaning, feature engineering, model comparison, hyperparameter tuning, and interpretable evaluation. The final Random Forest model was selected from five supervised classifiers and applied to an unseen test set.",
    year: "2025",
    category: "Data Analytics / Machine Learning",
    gallery_images: [
      "/projects/cardiovascular-model-comparison.png",
      "/projects/cardiovascular-feature-importance.png",
      "/projects/cardiovascular-random-forest-confusion-matrix.png",
      "/projects/cardiovascular-random-forest-roc.png"
    ],
    techStack: ["Python", "Pandas", "Scikit-learn", "Seaborn", "GridSearchCV"],
    tags: ["Data Analytics", "Healthcare", "Machine Learning", "Feature Engineering"],
    icon: "healthcare",
    caseStudy: {
      problem:
        "Predict whether an individual has cardiovascular disease from anonymized examination records while keeping the workflow reproducible and the final model interpretable.",
      dataset:
        "Approximately 56,000 records with 13 attributes, including age, gender, height, weight, systolic and diastolic blood pressure, cholesterol, glucose, smoking, alcohol use, physical activity, and the binary cardio target. Cleaning retained roughly 50,000 valid records.",
      approach:
        "Converted age from days to years, standardized categorical and binary fields, removed physiologically implausible blood pressure and body-measurement values, engineered BMI, filtered extreme BMI values, standardized numerical features, and used a 70/30 train-validation split.",
      models:
        "Logistic Regression, Decision Tree, Random Forest, K-Nearest Neighbors, and Support Vector Machine. Random Forest hyperparameters were tuned with GridSearchCV and 5-fold cross-validation.",
      evaluation:
        "Compared accuracy, validation F1, 5-fold cross-validation F1, ROC-AUC, confusion matrices, and ROC curves under the same preprocessing and validation conditions.",
      results:
        "Random Forest delivered the strongest overall result with validation F1 = 0.7316, CV F1 mean = 0.7305, and ROC-AUC approximately 0.804. Feature importance identified systolic blood pressure as the strongest predictor, followed by diastolic blood pressure, age, cholesterol, and BMI. The final Kaggle submission achieved a public score of 0.62542.",
      learned:
        "The project reinforced that data quality and feature engineering can matter as much as algorithm choice. It also highlighted the importance of cross-validation, threshold-aware metrics, and interpretable outputs when communicating healthcare models."
    }
  },
  {
    title: "SMS Spam Classification",
    summary:
      "Built a TF-IDF text-classification pipeline for 5,572 SMS messages and compared Perceptron with Multinomial Naive Bayes using stratified 5-fold cross-validation; Perceptron achieved a mean F1 score of 0.9147.",
    long_description:
      "An end-to-end natural language processing project for classifying SMS messages as spam or ham. The workflow combines TF-IDF feature extraction, imbalance-aware cross-validation, model comparison, and a small set of realistic message tests.",
    year: "2025",
    category: "Natural Language Processing",
    gallery_images: [
      "/projects/sms-class-distribution.png",
      "/projects/sms-model-comparison.png"
    ],
    techStack: ["Python", "Pandas", "Scikit-learn", "TF-IDF", "StratifiedKFold"],
    tags: ["NLP", "Text Classification", "TF-IDF", "Model Evaluation"],
    icon: "nlp",
    caseStudy: {
      problem:
        "Classify SMS messages as spam or ham with a reproducible text pipeline while accounting for class imbalance and the practical cost of incorrectly filtering legitimate messages.",
      dataset:
        "The UCI SMS Spam Collection contains 5,572 labeled messages: 4,825 ham messages (86.6%) and 747 spam messages (13.4%). Labels were encoded as ham = 0 and spam = 1.",
      approach:
        "Converted text into TF-IDF vectors using English stop-word removal, unigram and bigram features, a 10,000-feature limit, and sublinear term-frequency scaling. Each classifier was wrapped in a scikit-learn Pipeline and evaluated with shuffled Stratified 5-Fold cross-validation.",
      models:
        "Perceptron (max_iter = 1000, tol = 1e-3, random_state = 42) and Multinomial Naive Bayes.",
      evaluation:
        "Compared mean accuracy, precision, recall, and F1 across five stratified folds, with particular attention to precision-recall trade-offs caused by the imbalanced label distribution.",
      results:
        "Perceptron achieved mean accuracy = 0.9772, precision = 0.9190, recall = 0.9116, and F1 = 0.9147. Naive Bayes achieved accuracy = 0.9690 and perfect precision = 1.0000, but lower recall = 0.7684 and F1 = 0.8687. Perceptron provided the stronger overall balance, while both models correctly classified all five small-scale test messages.",
      learned:
        "The project demonstrated why accuracy alone can be misleading for imbalanced text data. Stratified evaluation and precision-recall analysis made the trade-off clear: Naive Bayes was highly conservative about flagging spam, while Perceptron recovered substantially more spam with a better overall F1 score."
    }
  },
  {
    title: "Smart Retail Checkout System",
    summary:
      "Built as a three-member group project, this smart checkout prototype combines 200-SKU YOLO detection with a Django workflow for mobile capture, human review, billing, receipts, and checkout history.",
    long_description:
      "A three-member group project that connects real-time product detection to a usable retail checkout workflow. The team prepared a large checkout-scene dataset, compared three lightweight YOLO detectors, and integrated the selected model into a responsive Django application with desktop and mobile input, editable billing, receipts, and history management.",
    year: "2026",
    category: "Computer Vision / Deep Learning / Group Project",
    gallery_images: [
      "/projects/smart-retail-model-comparison.png",
      "/projects/smart-retail-system-architecture.png",
      "/projects/smart-retail-checkout-review.png",
      "/projects/smart-retail-mobile-capture.png",
      "/projects/smart-retail-detection-results.png"
    ],
    sort_order: 4,
    techStack: ["Python", "Ultralytics YOLO", "Django", "AWS SageMaker", "COCO / YOLO"],
    tags: ["Group Project", "Deep Learning", "Object Detection", "Human-in-the-loop"],
    icon: "vision",
    caseStudy: {
      problem:
        "Recognize multiple SKU-level products in one checkout image and convert detections into a reliable, editable bill without allowing uncertain predictions to flow directly into payment decisions.",
      dataset:
        "The team repurposed the RPC val2019 checkout-scene subset into a closed-set dataset with 200 SKU classes across 17 product categories, 6,000 images, and 73,602 bounding boxes. Easy, Medium, and Hard scenes were stratified into an 80/10/10 train-validation-test split, producing 4,800 training, 600 validation, and 600 test images.",
      approach:
        "Converted COCO annotations into YOLO format, trained three lightweight detectors under shared settings, and mapped predictions to product names, quantities, prices, GST, and totals. The selected model was integrated into a layered Django system supporting local upload, demo images, mobile QR capture, low-confidence warnings, manual corrections, receipt generation, and checkout history.",
      models:
        "YOLOv5nu, YOLOv8n, and YOLOv8s were trained at 640 x 640 for up to 300 epochs with batch size 8 and early stopping patience 50 on an AWS SageMaker ml.g4dn.xlarge instance with an NVIDIA Tesla T4 GPU.",
      evaluation:
        "Compared precision, recall, mAP@0.5, mAP@0.5:0.95, a predefined weighted score, inference speed, convergence curves, precision-recall curves, F1-confidence curves, and qualitative checkout-scene predictions on the held-out test set.",
      results:
        "YOLOv8n was selected for deployment with precision = 0.99183, recall = 0.99476, mAP@0.5 = 0.99389, mAP@0.5:0.95 = 0.87068, and the highest weighted score of 0.93221. The Django prototype successfully connected image submission, SKU aggregation, editable bill review, receipt generation, and transaction history.",
      learned:
        "The group project showed that strong detection metrics are only one part of an operational ML system. Closed-set recognition, occlusion, visually similar packaging, and low-confidence predictions make human review and transparent correction controls essential for dependable checkout assistance."
    }
  },
  {
    title: "Hybrid Sparse-Dense Retrieval for RAG",
    summary:
      "Evaluated BM25, dense retrieval, and Hybrid RRF in a four-member group project across 10,570 SQuAD questions; Hybrid RRF led every main metric with Recall@10 = 0.9305 and MRR = 0.7574.",
    long_description:
      "A four-member group project investigating retrieval quality as a bottleneck in Retrieval-Augmented Generation systems. The study combines lexical and semantic retrieval through Reciprocal Rank Fusion, then tests retrieval methods, chunk sizes, embedding models, efficiency trade-offs, and per-question failure patterns.",
    year: "2026",
    category: "Natural Language Processing / Group Project",
    gallery_images: [
      "/projects/rag-retrieval-comparison.png",
      "/projects/rag-chunking-comparison.png",
      "/projects/rag-embedding-model-comparison.png",
      "/projects/rag-error-analysis.png"
    ],
    sort_order: 5,
    techStack: ["Python", "FAISS", "Sentence Transformers", "BM25", "Hugging Face"],
    tags: ["Group Project", "RAG", "Information Retrieval", "NLP"],
    icon: "nlp",
    caseStudy: {
      problem:
        "Improve the document-retrieval stage of a RAG pipeline, where lexical mismatch can cause BM25 to miss semantically relevant documents and dense retrieval can overlook useful exact-term signals.",
      dataset:
        "The main experiment used the complete SQuAD v1.1 validation set: 10,570 questions mapped to 2,067 unique context documents. Chunking, embedding-model comparison, and per-question error analysis used reproducible 2,000-question subsets for computational efficiency.",
      approach:
        "Built a BM25 lexical baseline and a dense FAISS index using normalized sentence-transformer embeddings. Hybrid retrieval fused the top 50 candidates from both rankers with Reciprocal Rank Fusion using k = 60. Additional experiments compared 100-, 200-, and 400-word chunks, three embedding models, and method-specific failure cases.",
      models:
        "BM25Okapi, all-MiniLM-L6-v2 dense retrieval, and Hybrid BM25-Dense RRF formed the main comparison. The embedding study additionally evaluated all-mpnet-base-v2 and BAAI bge-small-en-v1.5.",
      evaluation:
        "Measured Recall@1, Recall@3, Recall@5, Recall@10, and Mean Reciprocal Rank. Secondary experiments compared corpus encoding time, embedding dimensionality, chunk-count trade-offs, and per-question top-10 retrieval outcomes.",
      results:
        "On the full validation set, Hybrid RRF achieved Recall@1 = 0.6700, Recall@5 = 0.8749, Recall@10 = 0.9305, and MRR = 0.7574, leading both BM25 and dense retrieval on every main metric. On the 2,000-question embedding subset, bge-small produced the best Recall@1 and MRR, while mpnet-base achieved the highest Recall@10 at substantially greater encoding cost.",
      learned:
        "Sparse and dense signals were complementary, but the error analysis also showed that fusion is not automatically best for every subset or cutoff. Retrieval conclusions should therefore state the evaluation population clearly and balance aggregate metrics with question-level failure analysis and computational cost."
    }
  }
];

export const skillGroups = [
  {
    title: "Data Analytics & Programming",
    icon: Database,
    skills: [
      "Python",
      "SQL",
      "Pandas",
      "NumPy",
      "Data Cleaning",
      "Exploratory Data Analysis",
      "Matplotlib",
      "Seaborn",
      "Jupyter Notebook"
    ]
  },
  {
    title: "Machine Learning",
    icon: BrainCircuit,
    skills: [
      "Scikit-learn",
      "Supervised Learning",
      "Classification",
      "Feature Engineering",
      "Cross-validation",
      "Model Evaluation",
      "Error Analysis"
    ]
  },
  {
    title: "Deep Learning / Computer Vision",
    icon: Eye,
    skills: [
      "PyTorch",
      "CNN",
      "ResNet18",
      "Faster R-CNN",
      "SSD300",
      "OpenCV",
      "Object Detection",
      "Image Classification"
    ]
  },
  {
    title: "Tools & Languages",
    icon: Code2,
    skills: ["Git", "GitHub", "VS Code", "English", "Mandarin Chinese"]
  }
];

export const education = [
  {
    school: "University of Technology Sydney",
    degree: "Master of Information Technology",
    period: "2025 - Present",
    coursework: [
      "Database",
      "Data Analytics",
      "Advanced Data Analytics Algorithms",
      "Project Management",
      "Software Development"
    ]
  },
  {
    school: "Huazhong Agricultural University",
    degree: "Bachelor of Biotechnology",
    period: "2019 - 2023",
    coursework: [
      "Microbiology",
      "Cell Biology",
      "Genetics",
      "Biochemistry",
      "Genetic Engineering",
      "Pharmacology"
    ]
  }
];

export const workflowSteps = [
  "Data Preparation",
  "Feature Engineering",
  "Modeling",
  "Evaluation",
  "Error Analysis"
];

export const focusAreas = [
  "Data Analytics",
  "Applied Machine Learning",
  "Data Preparation",
  "Exploratory Analysis",
  "Computer Vision",
  "Model Evaluation"
];

export const quickStats = [
  { label: "Current degree", value: "MIT at UTS", icon: GraduationCap },
  { label: "Main focus", value: "Data Analytics", icon: BrainCircuit },
  { label: "Workflow mindset", value: "End to end", icon: Workflow },
  { label: "Location", value: "Sydney", icon: ChartNoAxesCombined }
];
