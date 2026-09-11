package com.inova27.app.utils;

import com.pgvector.PGvector;

import java.util.List;

public class EmbeddingUtils {

    private EmbeddingUtils() {
        throw new UnsupportedOperationException("Classe utilitária - não deve ser instanciada");
    }

    public static PGvector toVector(List<Double> valores) {
        float[] array = new float[valores.size()];

        for (int i = 0; i < valores.size(); i++) {
            array[i] = valores.get(i).floatValue();
        }

        return new PGvector(array);
    }


    public static String toPgVector(List<Double> valores) {
        return "[" +
                valores.stream()
                        .map(v -> String.format(java.util.Locale.US, "%.8f", v))
                        .collect(java.util.stream.Collectors.joining(",")) +
                "]";
    }
}
